"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";
import { parseVideoUrl } from "@/lib/video";
import { saveImage, deleteImage, imageUploadError } from "@/lib/uploads";

async function revalidateBand(bandId: string) {
  const band = await prisma.band.findUnique({
    where: { id: bandId },
    select: { slug: true },
  });
  revalidatePath("/");
  if (band) revalidatePath(`/bend/${band.slug}`);
}

function backToBand(bandId: string, query?: string): never {
  redirect(`/admin/bendovi/${bandId}${query ? `?${query}` : ""}`);
}

export async function addVideo(bandId: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseVideoUrl(String(formData.get("url") ?? ""));
  if (!parsed) {
    backToBand(
      bandId,
      `greska=${encodeURIComponent("Link mora biti YouTube ili Instagram snimak")}`,
    );
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
  backToBand(bandId);
}

export async function deleteVideo(bandId: string, videoId: string) {
  await requireAdmin();
  await prisma.video.deleteMany({ where: { id: videoId, bandId } });
  await revalidateBand(bandId);
  backToBand(bandId);
}

export async function moveVideo(
  bandId: string,
  videoId: string,
  direction: "up" | "down",
) {
  await requireAdmin();
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
  backToBand(bandId);
}

export async function uploadCover(bandId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("cover");
  if (!(file instanceof File) || file.size === 0) backToBand(bandId);
  const invalid = imageUploadError(file);
  if (invalid) backToBand(bandId, `greska=${encodeURIComponent(invalid)}`);

  const band = await prisma.band.findUnique({ where: { id: bandId } });
  if (!band) backToBand(bandId);
  if (band.coverImage) await deleteImage(band.coverImage);

  const coverImage = await saveImage(file, bandId);
  await prisma.band.update({ where: { id: bandId }, data: { coverImage } });
  await revalidateBand(bandId);
  backToBand(bandId);
}

export async function removeCover(bandId: string) {
  await requireAdmin();
  const band = await prisma.band.findUnique({ where: { id: bandId } });
  if (band?.coverImage) {
    await deleteImage(band.coverImage);
    await prisma.band.update({
      where: { id: bandId },
      data: { coverImage: null },
    });
    await revalidateBand(bandId);
  }
  backToBand(bandId);
}

export async function uploadPhotos(bandId: string, formData: FormData) {
  await requireAdmin();
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) backToBand(bandId);

  for (const file of files) {
    const invalid = imageUploadError(file);
    if (invalid) backToBand(bandId, `greska=${encodeURIComponent(invalid)}`);
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
  backToBand(bandId);
}

export async function deletePhoto(bandId: string, photoId: string) {
  await requireAdmin();
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (photo && photo.bandId === bandId) {
    await deleteImage(photo.path);
    await prisma.photo.delete({ where: { id: photoId } });
    await revalidateBand(bandId);
  }
  backToBand(bandId);
}
