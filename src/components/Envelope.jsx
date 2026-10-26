const Heart = () => (
  <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.4h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" /></svg>
);

// Sehrli konvert: muhrni bosganda aylanadi, qopqoq ochiladi, xat ko'tariladi
export default function Envelope({ open, onToggle, name = "", hint, big = false }) {
  return (
    <div className={`env-wrap ${big ? "big" : ""}`}>
      <div className={`env ${open ? "open" : ""}`}>
        <div className="glow" />
        <div className="back" />
        <div className="paper"><span>{name ? `❤ ${name}` : "❤"}</span></div>
        <div className="pocket" />
        <div className="flap" />
        <i className="wave" />
        <button type="button" className="seal" onClick={onToggle} aria-label="Konvertni ochish">
          <span className="wax" />
          <span className="ring" />
          <Heart />
        </button>
        {open && Array.from({ length: 10 }).map((_, i) => (
          <b key={i} className="spark" style={{ "--a": i * 36 + "deg", "--dl": i * 40 + "ms" }} />
        ))}
      </div>
      {hint && <p className="tap-hint">{hint}</p>}
    </div>
  );
}
