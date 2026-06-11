"use client";

import { useEffect } from "react";

// Broji pregled profila jednom po sesiji pregledača (da se brojač ne napumpava)
export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `pregledano-${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/bands/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
