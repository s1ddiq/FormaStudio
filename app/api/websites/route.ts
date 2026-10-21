import { randomUUID } from "node:crypto";
import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isWebsiteAdmin } from "@/lib/website-admin";

const namePattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/;

function getToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing from your environment.");
  }

  return token;
}

function errorResponse(label: string, error: unknown) {
  console.error(label, error);

  return NextResponse.json(
    {
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "The website request failed. Check the server logs.",
    },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    if (!(await isWebsiteAdmin())) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const token = getToken();
    const name = new URL(request.url).searchParams.get("name");

    if (name !== null) {
      if (!namePattern.test(name)) {
        return NextResponse.json(
          { error: "Invalid website name." },
          { status: 400 },
        );
      }

      const pathname = `websites/${name}.json`;

      const { blobs } = await list({
        prefix: pathname,
        token,
      });

      const blob = blobs.find((item) => item.pathname === pathname);

      if (!blob) {
        return NextResponse.json(
          { error: "Website not found." },
          { status: 404 },
        );
      }

      const url = new URL(blob.url);
      url.searchParams.set("v", randomUUID());

      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Could not read the website file: HTTP ${response.status}.`,
        );
      }

      const website: unknown = await response.json();

      if (
        typeof website !== "object" ||
        website === null ||
        !("name" in website) ||
        !("code" in website) ||
        typeof website.name !== "string" ||
        typeof website.code !== "string"
      ) {
        throw new Error("Invalid website file.");
      }

      return NextResponse.json(
        { name, code: website.code },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const websites: { name: string }[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({
        prefix: "websites/",
        cursor,
        limit: 1000,
        token,
      });

      for (const blob of result.blobs) {
        const match = /^websites\/([a-zA-Z0-9][a-zA-Z0-9-]{0,79})\.json$/.exec(
          blob.pathname,
        );

        if (match) {
          websites.push({ name: match[1] });
        }
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    websites.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(
      { websites },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse("[GET /api/websites]", error);
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isWebsiteAdmin())) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    }

    const name = new URL(request.url).searchParams.get("name");

    if (!name || !namePattern.test(name)) {
      return NextResponse.json(
        { error: "Invalid website name." },
        { status: 400 },
      );
    }

    await del(`websites/${name}.json`, {
      token: getToken(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse("[DELETE /api/websites]", error);
  }
}
