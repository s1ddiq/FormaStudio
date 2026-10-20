"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE,
  SESSION_SECONDS,
  createAdminSession,
} from "@/lib/website-admin";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const expectedPassword = process.env.WEBSITE_ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new Error("WEBSITE_ADMIN_PASSWORD is missing.");
  }

  if (typeof password !== "string") {
    redirect("/l?error=1");
  }

  const received = createHash("sha256").update(password).digest();
  const expected = createHash("sha256").update(expectedPassword).digest();

  if (!timingSafeEqual(received, expected)) {
    redirect("/l?error=1");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  redirect("/l");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_COOKIE);

  redirect("/l");
}
