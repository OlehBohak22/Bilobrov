import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; // Переконайся, що шлях правильний
import s from "./CartPopup.module.css";

interface CartPopupProps {
  onClose: () => void;
}

export const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className={s.popupOverlay} onClick={onClose}>
      <div className={s.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.popupHeader}>
          <h2 className={s.popupTitle}>Корзина</h2>
          <button className={s.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <ul className={s.popupList}>
          {cartItems.map((item) => (
            <li key={item.key} className={s.popupListItem}>
              Товар ID: {item.id} — Кількість: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
