// Oddiy sinxron hash (cyrb53). Bu faqat ochiq matnni yashirish uchun, haqiqiy xavfsizlik emas.
export function hashPass(str) {
  const s = "sl:" + str;
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < s.length; i++) {
    ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return String(4294967296 * (2097151 & h2) + (h1 >>> 0));
}

export function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export function safeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
export function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* xotira to'lgan bo'lishi mumkin */
  }
}

// Rasmni kichraytirib, JPEG data-URL qaytaradi (xotirani tejash uchun)
export function fileToDataUrl(file, max = 900) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

export const fmtDate = (t) =>
  new Date(t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export const PLACE_LABEL = { walk: "Aylanamiz 🚶", cinema: "Kino 🎬", cafe: "Kafe ☕", park: "Park 🌳" };

// Havolani ulashish: Android ulashish oynasi, bo'lmasa brauzer, bo'lmasa nusxa olish
export async function shareLink(url, text = "Sizga xat bor 💌") {
  try {
    const { Share } = await import("@capacitor/share");
    await Share.share({ title: "Self Love", text, url, dialogTitle: "Havolani ulashish" });
    return "shared";
  } catch { /* web rejimi */ }
  if (navigator.share) {
    try { await navigator.share({ title: "Self Love", text, url }); return "shared"; }
    catch (e) { if (e?.name === "AbortError") return "cancel"; }
  }
  try { await navigator.clipboard.writeText(url); return "copied"; } catch { return "fail"; }
}
export async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch { return false; }
}
