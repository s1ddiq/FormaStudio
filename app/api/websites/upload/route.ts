import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { isWebsiteAdmin } from "@/lib/website-admin";

const reservedNames = new Set(["l", "api", "admin", "login", "www", "_next"]);

const imageContentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      request,
      body,

      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await isWebsiteAdmin())) {
          throw new Error("Please sign in.");
        }

        const websiteMatch =
          /^websites\/([a-zA-Z0-9][a-zA-Z0-9-]{0,79})\.json$/.exec(pathname);

        const imageMatch =
          /^website-assets\/([a-zA-Z0-9][a-zA-Z0-9-]{0,79})\/[a-f0-9-]{36}\/\d+\.(jpg|png|webp|gif|avif)$/.exec(
            pathname,
          );

        const websiteName = websiteMatch?.[1] ?? imageMatch?.[1];

        if (!websiteName || reservedNames.has(websiteName.toLowerCase())) {
          throw new Error("Invalid website name.");
        }

        let editing = false;

        if (clientPayload) {
          const payload: unknown = JSON.parse(clientPayload);

          editing =
            typeof payload === "object" &&
            payload !== null &&
            "mode" in payload &&
            payload.mode === "edit";
        }

        return {
          allowedContentTypes: websiteMatch
            ? ["application/json"]
            : [imageContentTypes[imageMatch![2]]],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: Boolean(websiteMatch && editing),
          cacheControlMaxAge: 60,
          callbackUrl: request.url,
        };
      },

      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Check your login, file, and website name." },
      { status: 400 },
    );
  }
}
