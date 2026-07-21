// Shared client-side upload constraints for the admin managers (T7.5).
// Keeps file-type/size validation and the file-picker `accept` list identical
// across the three uploading managers (projects, clients, credentials).

const MB = 1024 * 1024;

// SVG is deliberately excluded: SVGs can carry embedded scripts, making them a
// stored-XSS vector if an uploaded file is ever rendered outside an <img> tag
// (e.g. opened top-level via a signed URL, as the documents manager does).
const IMAGE_TYPES: readonly string[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
];

const DOCUMENT_TYPES: readonly string[] = ["application/pdf", ...IMAGE_TYPES];

type KindConfig = {
  maxBytes: number;
  types: readonly string[];
  accept: string;
  typeLabel: string;
};

const UPLOAD_KINDS: Record<"image" | "document", KindConfig> = {
  image: {
    maxBytes: 5 * MB,
    types: IMAGE_TYPES,
    accept: IMAGE_TYPES.join(","),
    typeLabel: "an image (PNG, JPEG, WebP, GIF, or AVIF)",
  },
  document: {
    maxBytes: 10 * MB,
    types: DOCUMENT_TYPES,
    accept: DOCUMENT_TYPES.join(","),
    typeLabel: "a PDF or image file",
  },
};

export type UploadKind = keyof typeof UPLOAD_KINDS;

export const UPLOAD_ACCEPT: Record<UploadKind, string> = {
  image: UPLOAD_KINDS.image.accept,
  document: UPLOAD_KINDS.document.accept,
};

/** Returns a human-readable error when the file is the wrong type or too large, else null. */
export function validateUploadFile(file: File, kind: UploadKind): string | null {
  const { maxBytes, types, typeLabel } = UPLOAD_KINDS[kind];
  if (!types.includes(file.type)) {
    return `Unsupported file type. Please upload ${typeLabel}.`;
  }
  if (file.size > maxBytes) {
    return `File is too large. Maximum ${Math.round(maxBytes / MB)} MB.`;
  }
  return null;
}
