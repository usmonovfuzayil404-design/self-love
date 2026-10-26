import { DEFAULT_API } from "./config.js";
import { safeGet, safeSet } from "./util.js";

export const getApiUrl = () => (safeGet("self-love:server", "") || DEFAULT_API || "").replace(/\/$/, "");
export const setApiUrl = (u) => safeSet("self-love:server", u.trim().replace(/\/$/, ""));
export const getToken = () => safeGet("self-love:token", "");
export const setToken = (t) => safeSet("self-love:token", t || "");

const MESSAGES = {
  bad_email: "Faqat Gmail manzil kiriting (ism@gmail.com).",
  bad_password: "Parol 6 dan 100 gacha belgi bo'lsin.",
  exists: "Bu Gmail allaqachon ro'yxatdan o'tgan. «Kirish»ni tanlang.",
  no_user: "Bunday foydalanuvchi topilmadi. Avval ro'yxatdan o'ting.",
  bad_credentials: "Parol noto'g'ri.",
  banned: "Hisobingiz bloklangan.",
  too_many: "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring.",
  no_quota: "Saytlar limiti tugadi. Paket tanlang.",
  bad_name: "Ism 2 dan 30 gacha belgi bo'lsin.",
  bad_body: "Xat matni 10 dan 700 gacha belgi bo'lsin.",
  bad_question: "Savol 3 dan 120 gacha belgi bo'lsin.",
  bad_sig: "Imzo 2 dan 30 gacha belgi bo'lsin.",
  bad_photo: "Rasm noto'g'ri yoki juda katta (5 MB gacha).",
  unauthorized: "Qaytadan kiring.",
  network: "Serverga ulanib bo'lmadi. Internetni va server manzilini tekshiring.",
  no_server: "Server manzili kiritilmagan. «Server» maydoniga bot manzilini yozing.",
};
export const errText = (e) => MESSAGES[e?.code] || "Xatolik yuz berdi. Qayta urinib ko'ring.";

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const base = getApiUrl();
  if (!base) throw Object.assign(new Error("no_server"), { code: "no_server" });
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const t = getToken();
  if (auth && t) headers.Authorization = `Bearer ${t}`;
  let res;
  try {
    res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw Object.assign(new Error("network"), { code: "network" });
  }
  let data = {};
  try { data = await res.json(); } catch { /* bo'sh javob */ }
  if (!res.ok || data.ok === false) {
    const code = data.error || (res.status === 401 ? "unauthorized" : "server");
    throw Object.assign(new Error(code), { code, status: res.status });
  }
  return data;
}
