import { useEffect, useState } from "react";
import Scene from "./Scene.jsx";
import Envelope from "./Envelope.jsx";
import Postcard from "./Postcard.jsx";
import ShapeCanvas from "./ShapeCanvas.jsx";
import Recipient, { CartoonStage, LetterPaper, MeetPicker, Polaroid } from "./Recipient.jsx";
import Packs from "./Packs.jsx";
import SiteFrame from "./SiteFrame.jsx";
import { DEFAULT_DRAFT, DEFAULT_Q, QUESTION_PRESETS, SAMPLE_BODY, STEPS, T, THEMES, themeOf } from "../data.js";
import { copyText, fileToDataUrl, shareLink } from "../util.js";
import { createCard, updateMe, useStore } from "../store.js";
import { api, errText } from "../api.js";

/* ---------- O'ng tomondagi jonli namuna ---------- */
function Stage({ d, step, onSample }) {
  const [open, setOpen] = useState(false);
  const th = themeOf(d.theme);
  const lang = d.slang;
  const tt = T[lang];
  const name = d.name.trim();
  const cover = d.style === "postcard"
    ? <Postcard theme={d.theme} open={open} onToggle={() => setOpen(!open)} name={name} hint={open ? "" : tt.tapCard} />
    : <Envelope open={open} onToggle={() => setOpen(!open)} name={name} hint={open ? "" : tt.tapSeal} big />;
  const q = d.question.trim() || DEFAULT_Q[lang];

  let content;
  switch (step.id) {
    case "slang":
      content = <LetterPaper instant name={name || "Madina"} body={SAMPLE_BODY[lang]} sig={d.sig || ""} lang={lang} />;
      break;
    case "shape":
      content = <div className="shape-box"><ShapeCanvas key={d.shape + d.theme} kind={d.shape} accent={th.accent} accent2={th.accent2} ink={th.ink} /></div>;
      break;
    case "photo":
      content = <Polaroid src={d.photo} empty="Rasm shu yerda chiqadi" />;
      break;
    case "photo2":
      content = <Polaroid src={d.photo2} rot={2} empty="Oxirgi rasm shu yerda" />;
      break;
    case "body":
      content = <LetterPaper instant name={name || "Madina"} body={d.body.trim() || SAMPLE_BODY[lang]} sig="" lang={lang} />;
      break;
    case "sig":
      content = <LetterPaper instant name={name || "Madina"} body={d.body.trim() || SAMPLE_BODY[lang]} sig={d.sig || "…"} lang={lang} />;
      break;
    case "question":
      content = (
        <div className="ask solo">
          <h3>{q}</h3>
          <div className="yn"><button className="btn primary">{tt.yes}</button><button className="btn ghost">{tt.no}</button></div>
        </div>
      );
      break;
    case "after":
      content = d.after === "meet" ? <MeetPicker lang={lang} compact /> : <CartoonStage lang={lang} which={d.after} />;
      break;
    default:
      content = cover;
  }
  return (
    <Scene theme={d.theme} className="stage-scene">
      <div className="stage-tag">Jonli namuna · {th.emoji} {th.uz}</div>
      <div className="stage-in" key={step.id + d.style + d.shape + d.after}>{content}</div>
      <button type="button" className="sample-btn" onClick={onSample}>▶ To'liq namunani ko'rish</button>
    </Scene>
  );
}

/* ---------- Chap tomondagi boshqaruvlar ---------- */
function Options({ value, onChange, items }) {
  return (
    <div className="opts">
      {items.map((o) => (
        <button key={o.v} type="button" className={`opt ${value === o.v ? "on" : ""}`} onClick={() => onChange(o.v)}>
          {o.view && <div className="opt-view">{o.view}</div>}
          <b>{o.title}</b>
          {o.sub && <small>{o.sub}</small>}
        </button>
      ))}
    </div>
  );
}

function PhotoPick({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { onChange(await fileToDataUrl(f)); } finally { setBusy(false); }
  };
  return (
    <div className="photo-pick">
      <label className="btn primary file">
        {busy ? "Yuklanmoqda…" : value ? "Boshqa rasm tanlash" : "📷 Rasm tanlash"}
        <input type="file" accept="image/*" hidden onChange={pick} />
      </label>
      {value && <button type="button" className="btn ghost" onClick={() => onChange(null)}>Olib tashlash</button>}
      <p className="muted">Ixtiyoriy. Xohlamasangiz, «Keyingi»ni bosing.</p>
    </div>
  );
}

function Controls({ step, d, set, cartoons }) {
  const mini = (style, theme) => (
    <Scene theme={theme} mini className="mini-scene">
      <div className="mini-wrap">
        {style === "envelope"
          ? <Envelope open={false} onToggle={() => {}} name="" />
          : <Postcard theme={theme} open={false} onToggle={() => {}} />}
      </div>
    </Scene>
  );
  switch (step.id) {
    case "slang":
      return <Options value={d.slang} onChange={(v) => set({ slang: v })} items={[
        { v: "uz", title: "🇺🇿 O'zbekcha", sub: "Sayt o'zbek tilida" },
        { v: "ru", title: "🇷🇺 Русский", sub: "Сайт на русском" },
      ]} />;
    case "name":
      return (
        <label className="field">Ism
          <input value={d.name} maxLength={30} placeholder="Masalan: Madina" onChange={(e) => set({ name: e.target.value })} autoFocus />
          <small className="muted">2 dan 30 gacha belgi · ism konvert ichidagi xatda ko'rinadi</small>
        </label>
      );
    case "style":
      return <Options value={d.style} onChange={(v) => set({ style: v })} items={[
        { v: "envelope", title: "💌 Konvert", sub: "Muhr bosilganda ochiladi", view: mini("envelope", d.theme) },
        { v: "postcard", title: "🎴 Otkritka", sub: "Muqova chapga ochiladi", view: mini("postcard", d.theme) },
      ]} />;
    case "theme":
      return (
        <div className="themes">
          {THEMES.map((t) => (
            <button key={t.key} type="button" className={`theme-tile ${d.theme === t.key ? "on" : ""}`} onClick={() => set({ theme: t.key })}>
              {mini(d.style, t.key)}
              <b>{t.emoji} {t.uz}</b>
            </button>
          ))}
        </div>
      );
    case "shape": {
      const th = themeOf(d.theme);
      const sv = (k) => <ShapeCanvas kind={k} accent={th.accent} accent2={th.accent2} ink={th.ink} />;
      return <Options value={d.shape} onChange={(v) => set({ shape: v })} items={[
        { v: "heart", title: "❤️ Yurak", sub: "Dunyo tillaridagi «sevaman» so'zlaridan yurak, keyin ism", view: <Scene theme={d.theme} mini className="mini-scene">{sv("heart")}</Scene> },
        { v: "sphere", title: "🪐 Sfera (3D Saturn)", sub: "Aylanadigan halqali sayyora", view: <Scene theme={d.theme} mini className="mini-scene">{sv("sphere")}</Scene> },
      ]} />;
    }
    case "photo": return <PhotoPick value={d.photo} onChange={(v) => set({ photo: v })} />;
    case "photo2": return <PhotoPick value={d.photo2} onChange={(v) => set({ photo2: v })} />;
    case "body": {
      const len = d.body.trim().length;
      return (
        <label className="field">Xat matni
          <textarea rows={8} value={d.body} maxLength={760} placeholder={SAMPLE_BODY[d.slang]} onChange={(e) => set({ body: e.target.value })} />
          <small className={len < 10 || len > 700 ? "bad" : "muted"}>{len} / 700 · yangi qator yangi abzats bo'ladi</small>
        </label>
      );
    }
    case "question":
      return (
        <div>
          <div className="chips">
            {QUESTION_PRESETS[d.slang].map((p) => (
              <button key={p} type="button" className={`chip ${d.question === p ? "on" : ""}`} onClick={() => set({ question: p })}>{p}</button>
            ))}
          </div>
          <label className="field">Yoki o'zingiznikini yozing
            <input value={d.question} maxLength={120} placeholder={DEFAULT_Q[d.slang]} onChange={(e) => set({ question: e.target.value })} />
          </label>
        </div>
      );
    case "after":
      return <Options value={d.after} onChange={(v) => set({ after: v })} items={[
        { v: "meet", title: "📍 Uchrashuvga chaqirish", sub: "U joy, kun va vaqtni tanlaydi" },
        ...cartoons.map((c) => ({ v: "c" + c.id, title: "🎬 " + c.uz, sub: "Birga multfilm ko'rish" })),
      ]} />;
    case "sig":
      return (
        <label className="field">Imzo
          <input value={d.sig} maxLength={30} placeholder="Sening …" onChange={(e) => set({ sig: e.target.value })} />
        </label>
      );
    default: return null;
  }
}

function validate(step, d) {
  if (step.id === "name" && (d.name.trim().length < 2 || d.name.trim().length > 30)) return "Ism 2 dan 30 gacha belgi bo'lsin.";
  if (step.id === "body" && (d.body.trim().length < 10 || d.body.trim().length > 700)) return "Matn 10 dan 700 gacha belgi bo'lsin.";
  if (step.id === "question" && d.question.trim() && (d.question.trim().length < 3)) return "Savol kamida 3 ta belgi bo'lsin.";
  if (step.id === "sig" && (d.sig.trim().length < 2 || d.sig.trim().length > 30)) return "Imzo 2 dan 30 gacha belgi bo'lsin.";
  return "";
}

export default function Wizard() {
  const { session, config } = useStore();
  const [i, setI] = useState(0);
  const [d, setD] = useState(DEFAULT_DRAFT);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [frame, setFrame] = useState(null);
  const [sample, setSample] = useState(false);
  const [packs, setPacks] = useState(false);
  const [toast, setToast] = useState("");
  const step = STEPS[i];
  const cartoons = config?.cartoons || [];
  const set = (p) => { setD((x) => ({ ...x, ...p })); setErr(""); };
  const left = session.left; // null = cheksiz (admin)

  useEffect(() => { api("/api/app/me").then((r) => updateMe(r.me)).catch(() => {}); }, []);  // limit admin tomonidan o'zgargan bo'lishi mumkin

  const flash = (t) => { setToast(t); setTimeout(() => setToast(""), 2200); };

  const next = async () => {
    const e = validate(step, d);
    if (e) return setErr(e);
    if (i < STEPS.length - 1) { setI(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setBusy(true);
    try {
      const card = await createCard({ ...d, name: d.name.trim(), body: d.body.trim(), question: d.question.trim(), sig: d.sig.trim() });
      setDone(card);
      window.scrollTo({ top: 0 });
    } catch (x) {
      if (x.code === "no_quota") setPacks(true); else setErr(errText(x));
    } finally { setBusy(false); }
  };

  const sampleSite = { ...d, name: d.name.trim() || "Madina", body: d.body.trim() || SAMPLE_BODY[d.slang], question: d.question.trim() || DEFAULT_Q[d.slang], sig: d.sig.trim() || "Jasur" };

  if (done) {
    const th = themeOf(done.theme);
    const body = done.body.length > 70 ? done.body.slice(0, 70) + "…" : done.body;
    const share = async () => { const r = await shareLink(done.link); if (r === "copied") flash("Havola nusxalandi"); };
    return (
      <div className="done">
        <div className="done-card card">
          <div className="check">✓</div>
          <h2>✅ Xatingiz tayyor!</h2>
          <ul className="sum">
            <li>👤 <b>{done.name}</b> · qiz</li>
            <li>🎨 {done.style === "envelope" ? "💌 Konvert" : "🎴 Otkritka"} · {th.emoji} {th.uz}</li>
            <li>🌐 Sayt tili: {done.lang === "ru" ? "Русский" : "O'zbekcha"}</li>
            <li>📝 {body}</li>
            <li>❓ {done.question}</li>
            <li>✍️ Imzo: {done.sig}</li>
          </ul>
          <small className="kicker">🔗 Havola (shuni yuboring)</small>
          <div className="linkbox"><code>{done.link}</code></div>
          <div className="row">
            <button className="btn primary" onClick={share}>📤 Ulashish</button>
            <button className="btn ghost" onClick={async () => flash((await copyText(done.link)) ? "Havola nusxalandi" : "Nusxalab bo'lmadi")}>Nusxa olish</button>
          </div>
          <button className="btn ghost wide" onClick={() => setFrame(done.preview)}>👁 Ko'rib chiqish (javob yuborilmaydi)</button>
          <p className="muted small-note">U xatni ochganda va javob berganda, natija «Saytlarim» bo'limida ko'rinadi.{left !== null && ` Yasash mumkin bo'lgan saytlar qoldi: ${left}.`}</p>
          <button className="btn primary wide" onClick={() => { setDone(null); setD(DEFAULT_DRAFT); setI(0); }}>✨ Yangi xat</button>
        </div>
        {frame && <SiteFrame url={frame} title="Ko'rib chiqish" onClose={() => setFrame(null)} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className="wizard">
      <div className="progress" role="list">
        {STEPS.map((s, k) => (
          <button key={s.id} role="listitem" className={`dot ${k === i ? "on" : k < i ? "past" : ""}`} onClick={() => k <= i && setI(k)} title={s.title}>
            <span>{s.n}</span>
          </button>
        ))}
        <div className="bar"><i style={{ width: `${(i / (STEPS.length - 1)) * 100}%` }} /></div>
      </div>

      <div className="wz-grid">
        <aside className="wz-right"><Stage d={d} step={step} onSample={() => setSample(true)} /></aside>
        <section className="wz-left card">
          <div className="step-head" key={step.id}>
            <small className="kicker">{step.n}/11 · {step.title}</small>
            <h2>{step.hint}</h2>
          </div>
          <div className="step-body" key={"b" + step.id}><Controls step={step} d={d} set={set} cartoons={cartoons} /></div>
          {err && <div className="err" role="alert">{err}</div>}
          {i === STEPS.length - 1 && left !== null && left <= 0 && <div className="info">Hisobingizda sayt limiti yo'q. Yaratishda paket oynasi chiqadi.</div>}
          <div className="nav">
            <button className="btn ghost" disabled={i === 0 || busy} onClick={() => setI(i - 1)}>← Orqaga</button>
            <button className="btn primary" disabled={busy} onClick={next}>{busy ? "Yaratilmoqda…" : i === STEPS.length - 1 ? "✨ Saytni yaratish" : "Keyingi →"}</button>
          </div>
          <p className="muted left-info">{left === null ? "Cheksiz" : `Qolgan saytlar: ${left} ta`} · <a onClick={() => setPacks(true)}>paketlar</a></p>
        </section>
      </div>
      {packs && <Packs onClose={() => setPacks(false)} />}
      {sample && <Recipient site={sampleSite} onClose={() => setSample(false)} />}
    </div>
  );
}
