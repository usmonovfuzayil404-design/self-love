import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Scene from "./Scene.jsx";
import Envelope from "./Envelope.jsx";
import Postcard from "./Postcard.jsx";
import ShapeCanvas from "./ShapeCanvas.jsx";
import { DEFAULT_Q, T, themeOf } from "../data.js";

export function Typewriter({ text, speed = 22, onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  useEffect(() => { if (n >= text.length && text.length) onDone?.(); }, [n, text, onDone]);
  return (
    <>
      {text.slice(0, n).split("\n").map((l, i) => <p key={i}>{l}</p>)}
      {n < text.length && <span className="caret" />}
    </>
  );
}

export const Polaroid = ({ src, rot = -3, empty }) => (
  <figure className="polaroid" style={{ "--rot": rot + "deg" }}>
    {src ? <img src={src} alt="" /> : <div className="ph-empty">📷<small>{empty || "Rasm"}</small></div>}
  </figure>
);

export const LetterPaper = ({ name, body, sig, lang, children, instant }) => {
  const tt = T[lang];
  return (
    <div className="letter">
      <h4>{tt.dear} {name || "…"},</h4>
      <div className="letter-text">{instant ? body.split("\n").map((l, i) => <p key={i}>{l}</p>) : children}</div>
      {sig && <div className="sig">— {sig}</div>}
    </div>
  );
};

const PLACES = ["walk", "cinema", "cafe", "park"];
export function MeetPicker({ lang, onConfirm, compact }) {
  const tt = T[lang];
  const [place, setPlace] = useState("");
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }), []);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(19);
  const [min, setMin] = useState(0);
  const UZ_M = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
  const UZ_W = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
  const dayLabel = (d) =>
    lang === "ru"
      ? d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })
      : `${UZ_W[d.getDay()]}, ${d.getDate()} ${UZ_M[d.getMonth()]}`;
  return (
    <div className={`meet ${compact ? "compact" : ""}`}>
      <h3>{tt.meetQ}</h3>
      <div className="places">
        {PLACES.map((p) => (
          <button key={p} type="button" className={`chip ${place === p ? "on" : ""}`} onClick={() => setPlace(p)}>{tt.places[p]}</button>
        ))}
      </div>
      <div className="selects">
        <label>{tt.day}<select value={day} onChange={(e) => setDay(+e.target.value)}>{days.map((d, i) => <option key={i} value={i}>{dayLabel(d)}</option>)}</select></label>
        <label>{tt.hour}<select value={hour} onChange={(e) => setHour(+e.target.value)}>{Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}</select></label>
        <label>{tt.minute}<select value={min} onChange={(e) => setMin(+e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i * 5}>{String(i * 5).padStart(2, "0")}</option>)}</select></label>
      </div>
      <button type="button" className="btn primary" disabled={!place}
        onClick={() => onConfirm?.({ place, when: `${dayLabel(days[day])}, ${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}` })}>
        {tt.confirm}
      </button>
    </div>
  );
}

export const CartoonStage = ({ lang, which, onWatch }) => (
  <div className="meet">
    <h3>{T[lang].cartoonQ}</h3>
    <div className="player"><span className="play">▶</span><small>{which === "c2" ? "Zootopia 2" : "Aladdin"}</small></div>
    <button type="button" className="btn primary" onClick={onWatch}>{T[lang].watch}</button>
  </div>
);

// To'liq qabul qiluvchi oqimi (qiz saytni qanday ko'rishini ko'rsatadi)
export default function Recipient({ site, onClose, onResult }) {
  const lang = site.slang || "uz";
  const tt = T[lang];
  const th = themeOf(site.theme);
  const [stage, setStage] = useState("intro");
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const [meet, setMeet] = useState(null);
  const q = site.question || DEFAULT_Q[lang];

  const toggle = () => {
    setOpen(true);
    setTimeout(() => setStage("shape"), site.style === "postcard" ? 1700 : 2300);
  };
  const answer = (a) => {
    onResult?.({ answer: a });
    if (a === "no") return setStage("no");
    setStage(site.after === "meet" ? "meet" : "cartoon");
  };

  return createPortal(
    <div className="recipient">
      <Scene theme={site.theme}>
        <button type="button" className="close-x" onClick={onClose} aria-label="Yopish">✕</button>
        <div className="r-stage" key={stage}>
          {stage === "intro" && (
            site.style === "postcard"
              ? <Postcard theme={site.theme} open={open} onToggle={toggle} name={site.name} hint={tt.tapCard} />
              : <Envelope open={open} onToggle={toggle} name={site.name} hint={tt.tapSeal} big />
          )}
          {stage === "shape" && (
            <>
              <div className="shape-box"><ShapeCanvas kind={site.shape} accent={th.accent} accent2={th.accent2} ink={th.ink} /></div>
              <button className="btn primary" onClick={() => setStage("name")}>{tt.cont}</button>
            </>
          )}
          {stage === "name" && (
            <>
              <div className="shape-box short"><ShapeCanvas kind={site.shape} accent={th.accent} accent2={th.accent2} ink={th.ink} name={site.name || "…"} morph /></div>
              <button className="btn primary" onClick={() => setStage("letter")}>{tt.read}</button>
            </>
          )}
          {stage === "letter" && (
            <div className="letter-col">
              {site.photo && <Polaroid src={site.photo} />}
              <LetterPaper name={site.name} sig={typed ? site.sig : ""} lang={lang}>
                <Typewriter text={site.body} onDone={() => setTyped(true)} />
              </LetterPaper>
              {typed && (
                <div className="ask">
                  <h3>{q}</h3>
                  <div className="yn">
                    <button className="btn primary" onClick={() => answer("yes")}>{tt.yes}</button>
                    <button className="btn ghost" onClick={() => answer("no")}>{tt.no}</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {stage === "meet" && <MeetPicker lang={lang} onConfirm={(m) => { setMeet(m); onResult?.({ answer: "yes", meet: m }); setStage("end"); }} />}
          {stage === "cartoon" && <CartoonStage lang={lang} which={site.after} onWatch={() => setStage("end")} />}
          {stage === "end" && (
            <div className="end">
              {site.photo2 && <Polaroid src={site.photo2} rot={2} />}
              <h3>{tt.thanks}</h3>
              {meet && <p className="muted">{tt.sent}: {tt.places[meet.place]} · {meet.when}</p>}
            </div>
          )}
          {stage === "no" && <div className="end"><h3>{tt.noThanks}</h3></div>}
        </div>
      </Scene>
    </div>,
    document.body
  );
}
