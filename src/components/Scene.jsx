import { useMemo } from "react";
import { themeVars } from "../data.js";
import { rng } from "../util.js";

// Har bir rang uchun animatsion fon. mini=true bo'lsa, kichik namuna uchun yengil variant.
export default function Scene({ theme, mini = false, children, className = "" }) {
  const items = useMemo(() => {
    const r = rng(theme.length * 977 + 13);
    const n = mini ? 0.35 : 1;
    const mk = (count, f) => Array.from({ length: Math.round(count * n) }, (_, i) => f(i));
    const fall = (count, extra = {}) =>
      mk(count, () => ({
        left: r() * 100, size: 8 + r() * 14, d: 9 + r() * 9, dl: -r() * 16, sway: 20 + r() * 50, rot: r() * 360, ...extra,
      }));
    const stars = mk(70, () => ({ left: r() * 100, top: r() * 100, s: 1 + r() * 2.2, d: 2 + r() * 4, dl: -r() * 6 }));
    return {
      stars,
      fall: fall(theme === "gulbahor" ? 22 : theme === "atirgul" ? 18 : 16),
      fly: mk(14, () => ({ left: r() * 100, top: 30 + r() * 60, d: 6 + r() * 6, dl: -r() * 8 })),
      shoot: mk(3, (i) => ({ top: 5 + r() * 40, left: 30 + r() * 60, d: 5 + i * 3, dl: i * 2.5 + r() * 2 })),
    };
  }, [theme, mini]);

  const hasStars = theme === "astro" || theme === "tun";
  return (
    <div className={`scene scene-${theme} ${mini ? "mini" : ""} ${className}`} style={themeVars(theme)}>
      <div className="scene-bg">
        {hasStars && items.stars.map((s, i) => (
          <i key={i} className="star" style={{ left: s.left + "%", top: s.top + "%", width: s.s, height: s.s, "--d": s.d + "s", "--dl": s.dl + "s" }} />
        ))}
        {theme === "astro" && (
          <>
            <div className="nebula n1" /><div className="nebula n2" />
            <div className="planet"><span className="ring" /></div>
            <div className="moon" />
            {!mini && items.shoot.map((s, i) => (
              <b key={i} className="shoot" style={{ top: s.top + "%", left: s.left + "%", "--d": s.d + "s", "--dl": s.dl + "s" }} />
            ))}
          </>
        )}
        {theme === "tun" && (
          <>
            <div className="moon big" />
            {items.fly.map((f, i) => (
              <u key={i} className="firefly" style={{ left: f.left + "%", top: f.top + "%", "--d": f.d + "s", "--dl": f.dl + "s" }} />
            ))}
          </>
        )}
        {theme === "shafaq" && (
          <>
            <div className="sun" />
            <div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
            <div className="hills" />
          </>
        )}
        {theme === "bahor" && (
          <>
            <div className="rays" />
            <div className="blob b1" /><div className="blob b2" />
          </>
        )}
        {theme === "gulbahor" && <div className="blob b1 pink" />}
        {["atirgul", "bahor", "gulbahor"].includes(theme) &&
          items.fall.map((f, i) => (
            <span key={i} className={`fall ${theme}`} style={{
              left: f.left + "%", width: f.size, height: f.size, "--d": f.d + "s", "--dl": f.dl + "s", "--sway": f.sway + "px", "--rot": f.rot + "deg",
            }} />
          ))}
      </div>
      <div className="scene-body">{children}</div>
    </div>
  );
}
