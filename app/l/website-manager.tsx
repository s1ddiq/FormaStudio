"use client";

import { useCallback, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Website = {
  name: string;
};

type Editor = {
  name: string;
  code: string;
};

const PAGE_SIZE = 3;

const buttonClass =
  "rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export default function WebsiteManager() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const query = search.trim().toLowerCase();

  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(query),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWebsites.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleWebsites = filteredWebsites.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const loadWebsites = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/websites", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load websites.");
      }

      setWebsites(data.websites);
      setPage(1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load websites.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWebsites();
  }, [loadWebsites]);

  async function openEditor(name: string) {
    if (
      editor &&
      !window.confirm("Discard the current editor and open another website?")
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/websites?name=${encodeURIComponent(name)}`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load website.");
      }

      setEditor({ name: data.name, code: data.code });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load website.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveWebsite() {
    if (!editor) return;

    if (!editor.code.trim()) {
      setError("Enter your website’s HTML.");
      return;
    }

    const file = new Blob(
      [JSON.stringify({ name: editor.name, code: editor.code })],
      { type: "application/json" },
    );

    if (file.size > 20 * 1024 * 1024) {
      setError("The website must be smaller than 20 MB.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await upload(`websites/${editor.name}.json`, file, {
        access: "public",
        contentType: "application/json",
        handleUploadUrl: "/api/websites/upload",
        clientPayload: JSON.stringify({ mode: "edit" }),
      });

      setMessage(`Saved ${editor.name}.`);
      setEditor(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save website.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteWebsite(name: string) {
    if (
      !window.confirm(
        `Delete "${name}"? Its /w/${name} page will stop working. This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/websites?name=${encodeURIComponent(name)}`,
        { method: "DELETE" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete website.");
      }

      const remaining = websites.filter((website) => website.name !== name);

      const remainingMatches = remaining.filter((website) =>
        website.name.toLowerCase().includes(query),
      );

      const remainingPages = Math.max(
        1,
        Math.ceil(remainingMatches.length / PAGE_SIZE),
      );

      setWebsites(remaining);
      setPage(Math.min(currentPage, remainingPages));

      if (editor?.name === name) {
        setEditor(null);
      }

      setMessage(`Deleted ${name}.`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete website.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Saved websites</h2>

        <button
          type="button"
          onClick={() => void loadWebsites()}
          disabled={loading || busy}
          className={buttonClass}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="website-search" className="text-sm font-medium">
          Search websites
        </label>

        <input
          id="website-search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by website name…"
          disabled={loading || busy}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}

      {!loading && !error && filteredWebsites.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {query
            ? "No websites match your search."
            : "No websites yet. Create one below, then click Refresh."}
        </p>
      )}

      <div className="space-y-3" aria-busy={loading}>
        {visibleWebsites.map((website) => (
          <div
            key={website.name}
            className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="break-all font-medium">{website.name}</p>

              <a
                href={`/w/${website.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground underline underline-offset-4"
              >
                Open website
              </a>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => void openEditor(website.name)}
                disabled={busy || loading}
                className={buttonClass}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => void deleteWebsite(website.name)}
                disabled={busy || loading}
                className={`${buttonClass} text-destructive`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWebsites.length > 0 && (
        <nav
          aria-label="Website pagination"
          className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, filteredWebsites.length)} of{" "}
            {filteredWebsites.length}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1 || busy || loading}
              className={buttonClass}
            >
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages || busy || loading}
              className={buttonClass}
            >
              Next
            </button>
          </div>
        </nav>
      )}

      {editor && (
        <div className="space-y-4 border-t border-border pt-5">
          <div>
            <h3 className="font-semibold">Editing {editor.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Address: /w/{editor.name}
            </p>
          </div>

          <label htmlFor="edit-code" className="block text-sm font-medium">
            Website HTML
          </label>

          <textarea
            id="edit-code"
            value={editor.code}
            disabled={busy}
            onChange={(event) =>
              setEditor({ ...editor, code: event.target.value })
            }
            spellCheck={false}
            className="min-h-96 w-full rounded-lg border border-input bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void saveWebsite()}
              disabled={busy}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("Discard changes?")) {
                  setEditor(null);
                }
              }}
              disabled={busy}
              className={buttonClass}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
