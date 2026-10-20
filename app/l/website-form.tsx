"use client";

import { useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";

export default function WebsiteForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setWebsiteUrl("");

    const websiteName = name.trim();

    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(websiteName)) {
      setError("Use 1–80 letters, numbers, or hyphens.");
      return;
    }

    if (!code.trim()) {
      setError("Enter your website’s HTML.");
      return;
    }

    const file = new Blob([JSON.stringify({ name: websiteName, code })], {
      type: "application/json",
    });

    if (file.size > 20 * 1024 * 1024) {
      setError("The website must be smaller than 20 MB.");
      return;
    }

    setSaving(true);

    try {
      await upload(`websites/${websiteName}.json`, file, {
        access: "public",
        handleUploadUrl: "/api/websites/upload",
      });

      setWebsiteUrl(`/w/${websiteName}`);
    } catch {
      setError(
        "Could not create the website. Check that you’re signed in and the name isn’t already taken.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Website name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="clientWebsite1"
          maxLength={80}
          spellCheck={false}
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-sm text-muted-foreground">
          Address: /w/{name.trim() || "clientWebsite1"}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium">
          Website code
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Paste a complete HTML document with your CSS and JavaScript."
          spellCheck={false}
          required
          className="min-h-96 w-full rounded-lg border border-input bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {websiteUrl && (
        <div role="status" className="rounded-lg border p-4">
          <p className="font-medium">Website created.</p>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm underline underline-offset-4"
          >
            Open {websiteUrl}
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Creating website…" : "Create website"}
      </button>
    </form>
  );
}
