import { useCallback, useEffect, useState } from "react";
import { CardItem, StatusBadge, useToast } from "./MySites.jsx";
import SiteFrame from "./SiteFrame.jsx";
import { api, errText } from "../api.js";
import { fmtDate } from "../util.js";

export default function Admin() {
  const [tab, setTab] = useState("stats");
  const [data, setData] = useState({});
  const [err, setErr] = useState("");
  const [frame, setFrame] = useState(null);
  const [toast, flash] = useToast();

  const load = useCallback(async () => {
    try {
      if (tab === "stats") setData({ stats: (await api("/api/app/admin/stats")).stats });
      else if (tab === "users") setData({ users: (await api("/api/app/admin/users")).users });
      else setData({ cards: (await api("/api/app/admin/cards")).cards });
      setErr("");
    } catch (e) { setErr(errText(e)); }
  }, [tab]);
  useEffect(() => { setData({}); load(); }, [load]);

  const act = async (path, body) => {
    try { await api(path, { method: "POST", body }); load(); } catch (e) { flash(errText(e)); }
  };
  const del = async (s) => {
    if (!confirm(`«${s.name}» o'chirilsinmi?`)) return;
    try { await api(`/api/app/cards/${s.code}`, { method: "DELETE" }); load(); } catch (e) { flash(errText(e)); }
  };

  const st = data.stats;
  const answered = data.cards?.filter((s) => s.status !== "pending") || [];
  const max = st ? Math.max(1, st.cards) : 1;

  return (
    <div className="admin">
      <div className="admin-head"><div><small className="kicker">Admin panel</small><h2>Boshqaruv</h2></div><button className="btn small ghost" onClick={load}>↻</button></div>
      <div className="tabs wide">
        {[["stats", "📊 Statistika"], ["users", "👥 Foydalanuvchilar"], ["sites", "🌐 Saytlar"], ["last", "🕒 Javoblar"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {err && <div className="err">{err}</div>}

      {tab === "stats" && st && (
        <>
          <div className="stat-grid">
            {[["👥", "Foydalanuvchilar", st.users, `bloklangan: ${st.banned}`], ["💌", "Yaratilgan xatlar", st.cards, `bugun: ${st.today}`], ["👀", "Ochilgan", st.opened, ""], ["✅", "Ha", st.yes, ""], ["🤍", "Yo'q", st.no, ""]].map(([ic, l, v, sub]) => (
              <div className="stat card" key={l}><span className="ic">{ic}</span><b>{v}</b><small>{l}</small>{sub && <em>{sub}</em>}</div>
            ))}
          </div>
          <div className="card bars">
            <h3>Javoblar</h3>
            {[["Ochilgan", st.opened, "a"], ["Ha", st.yes, "b"], ["Yo'q", st.no, "c"], ["Kutilmoqda", st.cards - st.opened, "d"]].map(([l, v, c]) => (
              <div className="barrow" key={l}><span>{l}</span><div><i className={c} style={{ width: `${(v / max) * 100}%` }} /></div><b>{v}</b></div>
            ))}
          </div>
        </>
      )}

      {tab === "users" && data.users && (
        <div className="user-list">
          {!data.users.length && <div className="empty card">Hali foydalanuvchi yo'q.</div>}
          {data.users.map((u) => (
            <div key={u.chat_id} className={`card user ${u.banned ? "banned" : ""}`}>
              <div className="user-top">
                <div><b>{u.name}</b><small className="muted">{u.source === "app" ? "📱 ilova" : "✈️ Telegram"} · {fmtDate(u.started_at)}</small></div>
                <span className="badge open">{u.used}/{u.quota} sayt</span>
              </div>
              <div className="acts">
                {[1, 3, 5, 10].map((n) => <button key={n} className="btn small ghost" onClick={() => act("/api/app/admin/quota", { chat_id: u.chat_id, n })}>➕{n}</button>)}
                <button className={`btn small ${u.banned ? "primary" : "ghost danger"}`} onClick={() => act("/api/app/admin/ban", { chat_id: u.chat_id, banned: !u.banned })}>{u.banned ? "Blokdan chiqarish" : "🚫 Ban"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "sites" && data.cards && (
        <div className="site-grid">
          {!data.cards.length && <div className="empty card">Hali sayt yo'q.</div>}
          {data.cards.map((s) => <CardItem key={s.code} s={s} admin onFrame={setFrame} onDelete={del} flash={flash} />)}
        </div>
      )}

      {tab === "last" && data.cards && (
        <div className="user-list">
          {!answered.length && <div className="empty card">Hali javob yo'q.</div>}
          {answered.map((s) => (
            <div key={s.code} className="card user">
              <div className="user-top"><div><b>{s.name}</b><small className="muted">👤 {s.owner}</small></div><StatusBadge s={s} /></div>
              <small className="muted">❓ {s.question}</small>
              {s.meet && <small>📍 {s.meet.place} · 🗓 {s.meet.when}</small>}
              <small className="muted">🕒 {s.answered_at ? fmtDate(s.answered_at) : ""}</small>
            </div>
          ))}
        </div>
      )}
      {frame && <SiteFrame url={frame.preview} title={frame.name} onClose={() => setFrame(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
