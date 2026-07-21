import { Loader2, ImageIcon } from "lucide-react";
import { useSignedUrl } from "@/lib/use-signed-url";

// Shared signed-image renderer for the admin CMS managers (projects, clients).
// Markup is byte-identical to the previous per-file copies; the only variation
// between call sites was the object-fit, exposed here as `fit`.
export default function SignedImage({
  bucket,
  path,
  className,
  fit,
}: {
  bucket: string;
  path: string | null;
  className?: string;
  fit: "object-cover" | "object-contain";
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
  return <img src={url} alt="" className={`${fit} ${className ?? ""}`} />;
}
