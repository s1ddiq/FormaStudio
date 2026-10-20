import type { Metadata } from "next";

import { isWebsiteAdmin } from "@/lib/website-admin";
import { login, logout } from "./actions";
import WebsiteForm from "./website-form";

export const metadata: Metadata = {
  title: "Website dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const authenticated = await isWebsiteAdmin();

  if (!authenticated) {
    const { error } = await searchParams;

    return (
      <main className="dark flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <form
          action={login}
          className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin login
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to create websites.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              Incorrect password.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Websites</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Name your website and paste its HTML.
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Sign out
            </button>
          </form>
        </header>

        <WebsiteForm />
      </div>
    </main>
  );
}
