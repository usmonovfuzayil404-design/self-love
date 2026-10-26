import { themeOf } from "../data.js";

// Otkritka: muqova chapga ochiladi
export default function Postcard({ open, onToggle, theme, name = "", hint }) {
  const t = themeOf(theme);
  const gid = "pc-" + theme;
  return (
    <div className="pc-wrap">
      <button type="button" className={`pc ${open ? "open" : ""}`} onClick={onToggle} aria-label="Otkritkani ochish">
        <span className="pc-inside"><span>{name ? `${name}, ❤` : "❤"}</span></span>
        <span className="pc-cover">
          <span className="pc-front">
            <svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={t.accent} /><stop offset="1" stopColor={t.accent2} />
                </linearGradient>
                <radialGradient id={gid + "g"} cx=".5" cy=".4" r=".6">
                  <stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="300" height="420" fill={`url(#${gid})`} />
              <rect width="300" height="420" fill={`url(#${gid}g)`} />
              <rect x="14" y="14" width="272" height="392" rx="10" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 6" />
              {Array.from({ length: 18 }).map((_, i) => (
                <circle key={i} cx={30 + ((i * 53) % 250)} cy={40 + ((i * 97) % 340)} r={1.5 + (i % 3)} fill="#fff" opacity={0.35 + (i % 4) * 0.12} />
              ))}
              <path transform="translate(150 190) scale(5.2) translate(-12 -12)" fill="#fff" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.4h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
              <text x="150" y="320" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="34" fill="#fff">Sen uchun</text>
            </svg>
          </span>
          <span className="pc-back">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.4h3.6C14.6 6.1 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" /></svg>
          </span>
        </span>
      </button>
      {hint && <p className="tap-hint">{hint}</p>}
    </div>
  );
}
