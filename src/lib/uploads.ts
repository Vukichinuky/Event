import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Slike žive van build foldera (spec: /data/uploads na Mac Miniju, bekapuje se)
export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR ?? "./data/uploads",
);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function imageUploadError(file: File): string | null {
  if (!IMAGE_TYPES[file.type]) return "Dozvoljeni formati: JPG, PNG, WebP";
  if (file.size > MAX_IMAGE_BYTES) return "Slika može imati najviše 5 MB";
  return null;
}

// Snima sliku i vraća javnu putanju (/uploads/...)
export async function saveImage(file: File, subdir: string): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  const name = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${subdir}/${name}`;
}

// Briše fajl po javnoj putanji; fajl koji ne postoji nije greška
export async function deleteImage(publicPath: string) {
  if (!publicPath.startsWith("/uploads/")) return;
  const filePath = path.resolve(
    path.join(UPLOAD_DIR, publicPath.slice("/uploads/".length)),
  );
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) return;
  await unlink(filePath).catch(() => {});
}
