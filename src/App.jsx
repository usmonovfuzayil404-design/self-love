import { useEffect, useState } from "react";
import Auth from "./components/Auth.jsx";
import Wizard from "./components/Wizard.jsx";
import MySites from "./components/MySites.jsx";
import Admin from "./components/Admin.jsx";
import { boot, logout, useStore } from "./store.js";
import { safeGet, safeSet } from "./util.js";

function useMode() {
  const [mode, setMode] = useState(() => safeGet("self-love:mode", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#050a18" : "#eaf6ee");
    safeSet("self-love:mode", mode);
  }, [mode]);
  return [mode, () => setMode(mode === "dark" ? "light" : "dark")];
}

export default function App() {
  const { session, ready, offline } = useStore();
  const [mode, toggleMode] = useMode();
  const [tab, setTab] = useState("create");

  useEffect(() => { boot(); }, []);
  useEffect(() => { setTab(session?.role === "admin" ? "admin" : "create"); }, [session?.role, session?.email]);

  return (
    <div className="app">
      <div className="app-bg" aria-hidden>
        <i className="blob a" /><i className="blob b" /><i className="blob c" /><i className="grid" />
      </div>
      <header className="topbar">
        <div className="brand"><span className="logo">💌</span><b>Self Love</b></div>
        <div className="top-right">
          <button className="mode-btn" onClick={toggleMode} aria-label="Yorug' / tungi rejim">
            <span className={`mode-knob ${mode}`}>{mode === "dark" ? "🌙" : "☀️"}</span>
          </button>
          {session && <button className="btn small ghost" onClick={logout} title={session.email}>Chiqish</button>}
        </div>
      </header>

      <main className="content">
        {!ready && <div className="splash"><span>💌</span></div>}
        {ready && !session && (
          <div className="hero">
            <h1>Sevgingizni <em>chiroyli</em> yetkazing</h1>
            <p>Konvert yoki otkritka, animatsion fon, so'zlardan yasalgan yurak yoki Saturn.</p>
          </div>
        )}
        {session?.role === "admin" && tab === "admin" && <Admin />}
        {session && tab === "create" && <Wizard />}
        {session && tab === "my" && <MySites />}
      </main>

      {session && (
        <nav className="nav-tabs">
          {session.role === "admin" && <button className={tab === "admin" ? "on" : ""} onClick={() => setTab("admin")}><i>🛡</i>Admin</button>}
          <button className={tab === "create" ? "on" : ""} onClick={() => setTab("create")}><i>✨</i>Yangi xat</button>
          <button className={tab === "my" ? "on" : ""} onClick={() => setTab("my")}><i>📋</i>Saytlarim</button>
        </nav>
      )}
      {ready && !session && <Auth offline={offline} />}
    </div>
  );
}
