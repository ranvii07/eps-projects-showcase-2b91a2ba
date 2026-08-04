import { Loader2, ImageIcon } from "lucide-react";
import { useSignedUrl } from "@/lib/use-signed-url";

// Shared signed-image renderer for the admin CMS managers (projects, clients)
// and the public project gallery. Markup is byte-identical to the previous
// per-file copies; the only variation between call sites was the object-fit,
// exposed here as `fit`.
//
// `alt` is optional and defaults to "" so the CMS call sites (where the image sits
// next to its own label in a table row) stay decorative and unchanged; the public
// gallery passes a real caption.
export default function SignedImage({
  bucket,
  path,
  className,
  fit,
  alt = "",
}: {
  bucket: string;
  path: string | null;
  className?: string;
  fit: "object-cover" | "object-contain";
  alt?: string;
}) {
  const { url, failed } = useSignedUrl(bucket, path);
  if (!path || failed)
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 text-zinc-600 ${className ?? ""}`}
      >
        <ImageIcon className="h-4 w-4" />
      </div>
    );
  if (!url)
    return (
      <div className={`flex items-center justify-center bg-zinc-800 ${className ?? ""}`}>
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
      </div>
    );
  return <img src={url} alt={alt} className={`${fit} ${className ?? ""}`} />;
}
