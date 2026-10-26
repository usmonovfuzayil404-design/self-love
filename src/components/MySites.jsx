import { useCallback, useEffect, useState } from "react";
import SiteFrame from "./SiteFrame.jsx";
import { themeOf } from "../data.js";
import { deleteCard, fetchCards } from "../store.js";
import { errText } from "../api.js";
import { PLACE_LABEL, copyText, fmtDate, shareLink } from "../util.js";

export const StatusBadge = ({ s }) =>
  s.status === "yes" ? <span className="badge yes">✅ Ha</span>
  : s.status === "no" ? <span className="badge no">🤍 Yo'q</span>
  : s.opened_at ? <span className="badge open">👀 Ochildi</span>
  : <span className="badge wait">⏳ Kutilmoqda</span>;

export function CardItem({ s, admin, onFrame, onDelete, flash }) {
  const th = themeOf(s.theme);
  const [more, setMore] = useState(false);
  return (
    <article className="site card">
      <div className="site-top">
        <div className="site-swatch" style={{ background: `linear-gradient(135deg, ${th.bg1}, ${th.bg2})` }}>
          <i style={{ background: th.accent }} /><i style={{ background: th.accent2 }} />
          <span>{s.style === "envelope" ? "💌" : "🎴"}</span>
        </div>
        <div className="site-info">
          <b>{s.name}</b>
          <small className="muted">{th.emoji} {th.uz} · {s.shape === "sphere" ? "🪐" : "❤️"} · {fmtDate(s.created_at)}</small>
          {admin && <small className="muted">👤 {s.owner}</small>}
          <StatusBadge s={s} />
        </div>
      </div>
      {s.meet && <div className="meet-line">📍 {PLACE_LABEL[s.meet.place] || s.meet.place} · 🗓 {s.meet.when}</div>}
      <div className="site-actions">
        <button className="btn small primary" onClick={() => onFrame(s)}>Ko'rish</button>
        <button className="btn small ghost" onClick={async () => { const r = await shareLink(s.link); if (r === "copied") flash("Havola nusxalandi"); }}>📤</button>
        <button className="btn small ghost" onClick={async () => flash((await copyText(s.link)) ? "Havola nusxalandi" : "Nusxalab bo'lmadi")}>🔗</button>
        <button className="btn small ghost" onClick={() => setMore(!more)}>{more ? "▲" : "▼"}</button>
        <button className="btn small ghost danger" onClick={() => onDelete(s)}>🗑</button>
      </div>
      {more && (
        <div className="site-detail">
          <p><b>Xat:</b> {s.body}</p><p><b>Savol:</b> {s.question}</p><p><b>Imzo:</b> {s.sig}</p>
          <p className="link-line">{s.link}</p>
        </div>
      )}
    </article>
  );
}

export function useToast() {
  const [t, setT] = useState("");
  return [t, (m) => { setT(m); setTimeout(() => setT(""), 2200); }];
}

export default function MySites() {
  const [cards, setCards] = useState(null);
  const [err, setErr] = useState("");
  const [frame, setFrame] = useState(null);
  const [toast, flash] = useToast();

  const load = useCallback(async () => {
    try { setCards(await fetchCards()); setErr(""); } catch (e) { setErr(errText(e)); }
  }, []);
  useEffect(() => {
    load();
    const id = setInterval(load, 20000); // javoblar o'zi yangilanib turadi
    return () => clearInterval(id);
  }, [load]);

  const remove = async (s) => {
    if (!confirm(`«${s.name}» sayti o'chirilsinmi? Havola ishlamay qoladi.`)) return;
    try { await deleteCard(s.code); load(); } catch (e) { flash(errText(e)); }
  };

  return (
    <div>
      <div className="list-head"><h2>Saytlarim</h2><button className="btn small ghost" onClick={load}>↻ Yangilash</button></div>
      {err && <div className="err">{err}</div>}
      {cards === null && !err && <div className="empty card">Yuklanmoqda…</div>}
      {cards && !cards.length && <div className="empty card">Hali sayt yo'q. «Yangi xat» bo'limidan yarating.</div>}
      <div className="site-grid">
        {cards?.map((s) => <CardItem key={s.code} s={s} onFrame={setFrame} onDelete={remove} flash={flash} />)}
      </div>
      {frame && <SiteFrame url={frame.preview} title={frame.name} onClose={() => setFrame(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
