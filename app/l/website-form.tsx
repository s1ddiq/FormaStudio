"use client";

import { useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";

type DetectedImage = {
  src: string;
  alt: string;
  file: File | null;
};

const MAX_SIZE = 20 * 1024 * 1024;

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

export default function WebsiteForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [images, setImages] = useState<DetectedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  function handleCodeChange(value: string) {
    setCode(value);
    setError("");
    setWebsiteUrl("");

    const document = new DOMParser().parseFromString(value, "text/html");

    setImages((previous) =>
      Array.from(document.querySelectorAll("img")).map((image, index) => {
        const src = image.getAttribute("src") ?? "";
        const alt = image.getAttribute("alt") ?? "";

        return {
          src,
          alt,
          file: previous[index]?.src === src ? previous[index].file : null,
        };
      }),
    );
  }

  function handleImageChange(index: number, file: File | null) {
    setError("");

    if (file && !imageExtensions[file.type]) {
      setError("Choose a JPG, PNG, WebP, GIF, or AVIF image.");
      return;
    }

    if (file && file.size > MAX_SIZE) {
      setError("Each image must be smaller than 20 MB.");
      return;
    }

    setImages((previous) =>
      previous.map((image, currentIndex) =>
        currentIndex === index ? { ...image, file } : image,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setWebsiteUrl("");
    setStatus("");

    const websiteName = name.trim();

    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(websiteName)) {
      setError("Use 1–80 letters, numbers, or hyphens.");
      return;
    }

    if (!code.trim()) {
      setError("Enter your website’s HTML.");
      return;
    }

    if (
      new Blob([JSON.stringify({ name: websiteName, code })]).size > MAX_SIZE
    ) {
      setError("The website must be smaller than 20 MB.");
      return;
    }

    setSaving(true);

    try {
      const replacements = new Map<number, string>();
      const selectedImages = images.filter((image) => image.file);
      const uploadedFiles = new Map<File, string>();
      const batchId = crypto.randomUUID();
      let completed = 0;

      for (const [index, image] of images.entries()) {
        if (!image.file) continue;

        let url = uploadedFiles.get(image.file);

        if (!url) {
          setStatus(
            `Uploading image ${completed + 1} of ${selectedImages.length}…`,
          );

          const extension = imageExtensions[image.file.type];

          if (!extension || image.file.size > MAX_SIZE) {
            throw new Error(
              "An image has an unsupported type or exceeds 20 MB.",
            );
          }

          const blob = await upload(
            `website-assets/${websiteName}/${batchId}/${index}.${extension}`,
            image.file,
            {
              access: "public",
              handleUploadUrl: "/api/websites/upload",
              contentType: image.file.type,
            },
          );

          url = blob.url;
          uploadedFiles.set(image.file, url);
        }

        replacements.set(index, url);
        completed += 1;
      }

      let updatedCode = code;

      if (replacements.size > 0) {
        const document = new DOMParser().parseFromString(code, "text/html");
        const imageElements = document.querySelectorAll("img");

        for (const [index, url] of replacements) {
          const image = imageElements[index];

          if (!image) {
            throw new Error("The image list changed. Please try again.");
          }

          image.setAttribute("src", url);

          // Prevent responsive or lazy-loaded sources overriding the upload.
          image.removeAttribute("srcset");
          image.removeAttribute("sizes");
          image.removeAttribute("data-src");
          image.removeAttribute("data-srcset");
          image.removeAttribute("crossorigin");

          // A <picture> source can otherwise override the <img> URL.
          const picture = image.closest("picture");

          if (picture) {
            picture.querySelectorAll("source").forEach((source) => {
              source.remove();
            });
          }
        }

        const doctype = document.doctype
          ? `${new XMLSerializer().serializeToString(document.doctype)}\n`
          : "";

        updatedCode = `${doctype}${document.documentElement.outerHTML}`;
      }

      const file = new Blob(
        [JSON.stringify({ name: websiteName, code: updatedCode })],
        { type: "application/json" },
      );

      if (file.size > MAX_SIZE) {
        throw new Error("The website must be smaller than 20 MB.");
      }

      setStatus("Saving website…");

      await upload(`websites/${websiteName}.json`, file, {
        access: "public",
        handleUploadUrl: "/api/websites/upload",
        contentType: "application/json",
      });

      handleCodeChange(updatedCode);
      setWebsiteUrl(`/w/${websiteName}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create the website. Check your login and website name.",
      );
    } finally {
      setSaving(false);
      setStatus("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={saving} className="min-w-0 space-y-6">
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
            className={inputClass}
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
            onChange={(event) => handleCodeChange(event.target.value)}
            placeholder="Paste a complete HTML document with your CSS and JavaScript."
            spellCheck={false}
            required
            className="min-h-96 w-full rounded-lg border border-input bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                Images ({images.length})
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a replacement for each image you want to upload. Leave it
                empty to keep the current URL.
              </p>
            </div>

            {images.map((image, index) => (
              <div
                key={`${index}:${image.src}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <label
                    htmlFor={`image-${index}`}
                    className="text-sm font-medium"
                  >
                    Image {index + 1}
                    {image.alt ? `: ${image.alt}` : ""}
                  </label>
                  <p className="break-all text-xs text-muted-foreground">
                    {image.src || "No image URL"}
                  </p>
                </div>

                <input
                  id={`image-${index}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;

                    handleImageChange(index, file);

                    // Allow selecting the same file again.
                    event.target.value = "";
                  }}
                  className={`${inputClass} text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground`}
                />

                {image.file && (
                  <div className="flex items-center justify-between gap-3">
                    <p className="break-all text-sm">
                      Selected: {image.file.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleImageChange(index, null)}
                      className="shrink-0 text-sm underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Creating website…" : "Create website"}
        </button>
      </fieldset>

      {status && (
        <p role="status" className="text-sm text-muted-foreground">
          {status}
        </p>
      )}

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
    </form>
  );
}
