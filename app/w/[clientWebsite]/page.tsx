import { list } from "@vercel/blob";
import { notFound } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

type Website = {
  name: string;
  code: string;
};

type Props = {
  params: Promise<{
    clientWebsite: string;
  }>;
};

export default async function ClientWebsitePage({ params }: Props) {
  await connection();

  const { clientWebsite } = await params;

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(clientWebsite)) {
    notFound();
  }

  const pathname = `websites/${clientWebsite}.json`;

  const { blobs } = await list({
    prefix: pathname,
    limit: 10,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const blob = blobs.find((item) => item.pathname === pathname);

  if (!blob) {
    notFound();
  }

  const response = await fetch(blob.url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load the website.");
  }

  const website: unknown = await response.json();

  if (
    typeof website !== "object" ||
    website === null ||
    typeof (website as Website).name !== "string" ||
    typeof (website as Website).code !== "string"
  ) {
    throw new Error("Invalid website file.");
  }

  const { name, code } = website as Website;

  return (
    <iframe
      title={name}
      srcDoc={code}
      sandbox="allow-scripts allow-forms allow-popups"
      referrerPolicy="no-referrer"
      className="fixed inset-0 z-50 h-dvh w-full border-0 bg-white"
    />
  );
}
