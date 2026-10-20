import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { isWebsiteAdmin } from "@/lib/website-admin";

const reservedNames = new Set(["l", "api", "admin", "login", "www", "_next"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      request,
      body,

      onBeforeGenerateToken: async (pathname) => {
        if (!(await isWebsiteAdmin())) {
          throw new Error("Please sign in.");
        }

        const match = /^websites\/([a-zA-Z0-9][a-zA-Z0-9-]{0,79})\.json$/.exec(
          pathname,
        );

        if (!match || reservedNames.has(match[1].toLowerCase())) {
          throw new Error("Choose another website name.");
        }

        return {
          allowedContentTypes: ["application/json"],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: false,
          callbackUrl: request.url,
        };
      },

      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Check your login and website name." },
      { status: 400 },
    );
  }
}
