import { useState } from "react";
import { authenticate } from "../store.js";
import { errText, getApiUrl, setApiUrl } from "../api.js";

// Ilova ochilishi bilan chiqadigan ro'yxatdan o'tish oynasi
export default function Auth({ offline }) {
  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [server, setServer] = useState(getApiUrl());
  const [openServer, setOpenServer] = useState(!getApiUrl());

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setApiUrl(server);
    setBusy(true);
    try { await authenticate(email, pass, mode); }
    catch (x) { setErr(errText(x)); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-back">
      <form className="auth" onSubmit={submit}>
        <div className="auth-logo"><span>💌</span><b>Self Love</b></div>
        <h2>{mode === "register" ? "Ro'yxatdan o'tish" : "Kirish"}</h2>
        <p className="muted">Sevgi xatingizni yaratish uchun Gmail manzilingizni kiriting.</p>
        <div className="tabs">
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => { setMode("register"); setErr(""); }}>Ro'yxatdan o'tish</button>
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); }}>Kirish</button>
        </div>
        <label>Gmail
          <input type="email" inputMode="email" autoComplete="email" placeholder="ism@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} required />
        </label>
        <label>Parol
          <div className="pass">
            <input type={show ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder="Kamida 6 ta belgi" value={pass} onChange={(e) => { setPass(e.target.value); setErr(""); }} required />
            <button type="button" onClick={() => setShow(!show)} aria-label="Parolni ko'rsatish">{show ? "🙈" : "👁"}</button>
          </div>
        </label>
        {(openServer || offline) && (
          <label>Server (bot manzili)
            <input type="url" inputMode="url" placeholder="https://sizning-ilova.onrender.com" value={server} onChange={(e) => setServer(e.target.value)} />
          </label>
        )}
        {offline && !err && <div className="err">Serverga ulanib bo'lmadi. Manzilni tekshiring.</div>}
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn primary wide" type="submit" disabled={busy}>{busy ? "Kuting…" : mode === "register" ? "Ro'yxatdan o'tish" : "Kirish"}</button>
        {!openServer && !offline && <a className="srv-link" onClick={() => setOpenServer(true)}>Server sozlamasi</a>}
      </form>
    </div>
  );
}
