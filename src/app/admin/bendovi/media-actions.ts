"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireBandAccess } from "@/lib/require-auth";
import { parseVideoUrl } from "@/lib/video";
import { saveImage, deleteImage, imageUploadError } from "@/lib/uploads";

// Akcije dele admin panel i bend panel — guard pušta admina ili vlasnika
// profila, a posle akcije svakog vraća na njegovu stranicu za uređivanje.
async function guard(bandId: string): Promise<string> {
  const user = await requireBandAccess(bandId);
  return user.role === "ADMIN" ? `/admin/bendovi/${bandId}` : "/dashboard/profil";
}

function back(backTo: string, error?: string): never {
  redirect(error ? `${backTo}?greska=${encodeURIComponent(error)}` : backTo);
}

async function revalidateBand(bandId: string) {
  const band = await prisma.band.findUnique({
    where: { id: bandId },
    select: { slug: true },
  });
  revalidatePath("/");
  if (band) revalidatePath(`/bend/${band.slug}`);
}

export async function addVideo(bandId: string, formData: FormData) {
  const backTo = await guard(bandId);
  const parsed = parseVideoUrl(String(formData.get("url") ?? ""));
  if (!parsed) {
    back(backTo, "Link mora biti YouTube ili Instagram snimak");
  }

  const last = await prisma.video.aggregate({
    where: { bandId },
    _max: { order: true },
  });
  await prisma.video.create({
    data: {
      bandId,
      url: String(formData.get("url")).trim(),
      platform: parsed.platform,
      order: (last._max.order ?? 0) + 1,
    },
  });

  await revalidateBand(bandId);
  back(backTo);
}

export async function deleteVideo(bandId: string, videoId: string) {
  const backTo = await guard(bandId);
  await prisma.video.deleteMany({ where: { id: videoId, bandId } });
  await revalidateBand(bandId);
  back(backTo);
}

export async function moveVideo(
  bandId: string,
  videoId: string,
  direction: "up" | "down",
) {
  const backTo = await guard(bandId);
  const videos = await prisma.video.findMany({
    where: { bandId },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  const index = videos.findIndex((v) => v.id === videoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index !== -1 && swapWith >= 0 && swapWith < videos.length) {
    await prisma.$transaction([
      prisma.video.update({
        where: { id: videos[index].id },
        data: { order: videos[swapWith].order },
      }),
      prisma.video.update({
        where: { id: videos[swapWith].id },
        data: { order: videos[index].order },
      }),
    ]);
    await revalidateBand(bandId);
  }
  back(backTo);
}

export async function uploadCover(bandId: string, formData: FormData) {
  const backTo = await guard(bandId);
  const file = formData.get("cover");
  if (!(file instanceof File) || file.size === 0) back(backTo);
  const invalid = imageUploadError(file);
  if (invalid) back(backTo, invalid);

  const band = await prisma.band.findUnique({ where: { id: bandId } });
  if (!band) back(backTo);
  if (band.coverImage) await deleteImage(band.coverImage);

  const coverImage = await saveImage(file, bandId);
  await prisma.band.update({ where: { id: bandId }, data: { coverImage } });
  await revalidateBand(bandId);
  back(backTo);
}

export async function removeCover(bandId: string) {
  const backTo = await guard(bandId);
  const band = await prisma.band.findUnique({ where: { id: bandId } });
  if (band?.coverImage) {
    await deleteImage(band.coverImage);
    await prisma.band.update({
      where: { id: bandId },
      data: { coverImage: null },
    });
    await revalidateBand(bandId);
  }
  back(backTo);
}

export async function uploadPhotos(bandId: string, formData: FormData) {
  const backTo = await guard(bandId);
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) back(backTo);

  for (const file of files) {
    const invalid = imageUploadError(file);
    if (invalid) back(backTo, invalid);
  }

  const last = await prisma.photo.aggregate({
    where: { bandId },
    _max: { order: true },
  });
  let order = (last._max.order ?? 0) + 1;
  for (const file of files) {
    await prisma.photo.create({
      data: { bandId, path: await saveImage(file, bandId), order: order++ },
    });
  }

  await revalidateBand(bandId);
  back(backTo);
}

export async function deletePhoto(bandId: string, photoId: string) {
  const backTo = await guard(bandId);
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (photo && photo.bandId === bandId) {
    await deleteImage(photo.path);
    await prisma.photo.delete({ where: { id: photoId } });
    await revalidateBand(bandId);
  }
  back(backTo);
}
