import type { VideoPlatform } from "@/generated/prisma/client";

export type ParsedVideo = { platform: VideoPlatform; embedUrl: string };

// Podržano: YouTube (watch, youtu.be, shorts, embed, live) i Instagram (p, reel, reels, tv)
export function parseVideoUrl(raw: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ytEmbed(id);
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v) return ytEmbed(v);
    const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/);
    if (match) return ytEmbed(match[1]);
    return null;
  }
  if (host === "instagram.com") {
    const match = url.pathname.match(/^\/(p|reel|reels|tv)\/([\w-]+)/);
    if (match) {
      const type = match[1] === "reels" ? "reel" : match[1];
      return {
        platform: "INSTAGRAM",
        embedUrl: `https://www.instagram.com/${type}/${match[2]}/embed`,
      };
    }
    return null;
  }
  return null;
}

function ytEmbed(id: string): ParsedVideo | null {
  if (!/^[\w-]{6,20}$/.test(id)) return null;
  return {
    platform: "YOUTUBE",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}
