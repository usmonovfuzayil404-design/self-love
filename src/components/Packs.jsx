import { useStore } from "../store.js";

export default function Packs({ onClose }) {
  const { config } = useStore();
  const packs = config?.packs || [];
  const contact = config?.contact;
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-x flat" onClick={onClose}>✕</button>
        <h2>Sayt paketlari</h2>
        <p className="muted">So'mda to'lash uchun admin bilan gaplashing. To'lovdan keyin saytlar hisobingizga qo'shiladi.</p>
        <div className="packs">
          {packs.map((p) => (
            <div key={p.n} className="pack"><b>{p.n} ta sayt</b><span>{p.som.toLocaleString("uz-UZ")} so'm</span><small>⭐ {p.stars} Stars</small></div>
          ))}
        </div>
        {contact && <a className="btn primary wide contact" href={`https://t.me/${contact}`} target="_blank" rel="noreferrer">👤 Admin bilan gaplashish (@{contact})</a>}
      </div>
    </div>
  );
}
