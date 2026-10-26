import { useEffect, useRef } from "react";
import { WORDS } from "../data.js";

// «Sevaman» so'zlaridan yurak yoki 3D Saturn (halqali sayyora)
export default function ShapeCanvas({ kind, accent, accent2, ink, name = "", morph = false }) {
  const ref = useRef(null);
  const props = useRef({});
  props.current = { kind, accent, accent2, ink, name, morph };

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf, w = 0, h = 0, dpr = 1;
    const t0 = performance.now();

    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    // yurak nuqtalari
    const heart = [];
    const HN = [52, 30, 14];
    HN.forEach((cnt, layer) => {
      const k = [1, 0.7, 0.42][layer];
      for (let i = 0; i < cnt; i++) {
        const t = (i / cnt) * Math.PI * 2 + layer * 0.3;
        const x = 16 * Math.sin(t) ** 3;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heart.push({ x: x * k, y: y * k, i: heart.length, layer });
      }
    });
    // sfera (Fibonacci) va halqa
    const sph = Array.from({ length: 64 }, (_, i) => {
      const y = 1 - (i / 63) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, i };
    });
    const ring = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2;
      return { x: Math.cos(a) * 1.5, y: 0, z: Math.sin(a) * 1.5, i: i + 7, ring: true };
    });

    const draw = (now) => {
      const { kind, accent, accent2, ink, name, morph } = props.current;
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const S = Math.min(w, h);

      if (morph && name) {
        // «Davom etish»dan keyin: qizning ismi
        const fs = Math.min(S * 0.2, w / (name.length * 0.62));
        ctx.font = `700 ${fs}px Caveat, cursive`;
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, accent); g.addColorStop(1, accent2);
        ctx.fillStyle = g;
        ctx.shadowColor = accent; ctx.shadowBlur = 24;
        ctx.globalAlpha = Math.min(1, t * 1.2);
        ctx.fillText(name, w / 2, h / 2);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
        return;
      }

      if (kind === "heart") {
        const pulse = 1 + Math.sin(t * 3) * 0.035;
        const sc = (S / 40) * pulse;
        heart.forEach((p) => {
          const appear = Math.min(1, Math.max(0, t * 1.6 - p.i * 0.012));
          if (!appear) return;
          const bob = Math.sin(t * 2 + p.i) * 1.2;
          const fs = Math.max(5.5, S * (p.layer === 0 ? 0.03 : 0.026));
          ctx.font = `600 ${fs}px Manrope, sans-serif`;
          ctx.globalAlpha = appear * (p.layer === 0 ? 1 : 0.75);
          ctx.fillStyle = p.i % 3 === 0 ? accent2 : p.i % 3 === 1 ? accent : ink;
          ctx.save();
          ctx.translate(w / 2 + p.x * sc, h / 2 + 2 + p.y * sc + bob);
          ctx.rotate(Math.atan2(p.y, p.x) * 0.0 + Math.sin(t + p.i) * 0.06);
          ctx.fillText(WORDS[p.i % WORDS.length], 0, 0);
          ctx.restore();
        });
        ctx.globalAlpha = 1;
      } else {
        const R = S * 0.27, tilt = 0.42, rot = t * 0.5;
        const all = [...sph, ...ring].map((p) => {
          const a = p.ring ? rot * 0.6 : rot;
          let x = p.x * Math.cos(a) + p.z * Math.sin(a);
          let z = -p.x * Math.sin(a) + p.z * Math.cos(a);
          let y = p.y;
          if (p.ring) { const c = Math.cos(-0.32), sn = Math.sin(-0.32); const nx = x * c - y * sn; y = x * sn + y * c; x = nx; }
          const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
          const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
          const persp = 9 / (9 - z2);
          return { ...p, sx: w / 2 + x * R * persp, sy: h / 2 + y2 * R * persp, z: z2, persp };
        });
        all.sort((a, b) => a.z - b.z);
        // planeta shari (yengil nur)
        const gr = ctx.createRadialGradient(w / 2 - R * 0.3, h / 2 - R * 0.3, R * 0.1, w / 2, h / 2, R * 1.05);
        gr.addColorStop(0, accent + "77"); gr.addColorStop(1, accent2 + "14");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(w / 2, h / 2, R, 0, 7); ctx.fill();
        ctx.strokeStyle = accent2 + "66"; ctx.lineWidth = 1.5; ctx.stroke();
        all.forEach((p) => {
          const depth = (p.z + 1.8) / 3.6;
          ctx.globalAlpha = Math.max(0.12, Math.min(1, depth * 1.15));
          ctx.fillStyle = p.ring ? accent2 : p.i % 2 ? accent : ink;
          ctx.font = `600 ${Math.max(5, S * (p.ring ? 0.026 : 0.027) * p.persp)}px Manrope, sans-serif`;
          ctx.fillText(WORDS[p.i % WORDS.length], p.sx, p.sy);
        });
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [kind, morph]);

  return <canvas ref={ref} className="shape-canvas" />;
}
