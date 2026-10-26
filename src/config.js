// ============ SOZLAMALAR ============
// Bot serveringiz manzili (bot.py ishlayotgan hosting, PUBLIC_URL bilan bir xil, https bo'lishi shart).
// Qurishdan oldin .env faylga yozing:  VITE_API_URL=https://sizning-ilova.onrender.com
// Yoki ilovaning kirish oynasidagi «Server» maydoniga yozing.
export const DEFAULT_API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
