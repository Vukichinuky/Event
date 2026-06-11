import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/uploads";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filePath = path.resolve(path.join(UPLOAD_DIR, ...segments));
  // zaštita od path traversal — fajl mora ostati unutar upload foldera
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(filePath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        // imena fajlova su nasumična i nepromenljiva
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
