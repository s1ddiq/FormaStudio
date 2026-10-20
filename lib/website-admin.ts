import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "website_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must contain at least 32 characters.",
    );
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);

  return `${expires}.${sign(expires)}`;
}

export async function isWebsiteAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expires, signature] = parts;

  if (
    !/^\d+$/.test(expires) ||
    !/^[a-f0-9]{64}$/.test(signature) ||
    Number(expires) <= Date.now()
  ) {
    return false;
  }

  const expected = Buffer.from(sign(expires), "hex");
  const received = Buffer.from(signature, "hex");

  return timingSafeEqual(expected, received);
}
