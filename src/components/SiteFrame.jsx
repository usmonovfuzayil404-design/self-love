import { createPortal } from "react-dom";

// Botning haqiqiy saytini ilova ichida ko'rsatadi (foydalanuvchi aynan nimani yuborayotganini ko'radi)
export default function SiteFrame({ url, title = "Sayt", onClose }) {
  return createPortal(
    <div className="frame-back">
      <div className="frame-bar">
        <b>{title}</b>
        <div>
          <a className="btn small ghost" href={url} target="_blank" rel="noreferrer">Brauzerda</a>
          <button className="btn small primary" onClick={onClose}>Yopish</button>
        </div>
      </div>
      <iframe className="frame" src={url} title={title} allow="autoplay; fullscreen" />
    </div>,
    document.body
  );
}
