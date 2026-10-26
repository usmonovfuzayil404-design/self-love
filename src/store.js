import { useSyncExternalStore } from "react";
import { api, getToken, setToken } from "./api.js";

let state = { ready: false, session: null, config: null, offline: false };
const subs = new Set();
const set = (p) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
export const useStore = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state);

const toSession = (me) => ({ email: me.email, role: me.role, left: me.left, used: me.used });

export async function boot() {
  try {
    const { config } = { config: await api("/api/app/config", { auth: false }) };
    set({ config, offline: false });
  } catch (e) {
    set({ offline: e.code === "network" });
  }
  if (getToken()) {
    try {
      const r = await api("/api/app/me");
      set({ session: toSession(r.me) });
    } catch (e) {
      if (e.code === "unauthorized") setToken("");
    }
  }
  set({ ready: true });
}

export async function authenticate(email, password, mode) {
  const r = await api("/api/app/auth", { method: "POST", auth: false, body: { email, password, mode } });
  setToken(r.token);
  set({ session: toSession(r.me) });
  if (!state.config) boot();
  return r.me;
}

export async function logout() {
  try { await api("/api/app/logout", { method: "POST" }); } catch { /* e'tiborsiz */ }
  setToken("");
  set({ session: null });
}

export const updateMe = (me) => me && set({ session: toSession(me) });

export async function createCard(draft) {
  const r = await api("/api/app/cards", { method: "POST", body: draft });
  updateMe(r.me);
  return r.card;
}
export async function fetchCards() {
  const r = await api("/api/app/cards");
  updateMe(r.me);
  return r.cards;
}
export const deleteCard = (code) => api(`/api/app/cards/${code}`, { method: "DELETE" });
