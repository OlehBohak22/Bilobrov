import { UserData } from "../../store/slices/userSlice";
import { AddressTab } from "../AddressTab/AddressTab";
import { useEffect, useRef, useState } from "react";
import s from "./AddressPopup.module.css";

interface AddressPopupProps {
  user: UserData | null;
  onClose: () => void;
}

export const AddressPopup = ({ user, onClose }: AddressPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mapPopup = document.getElementById("mapPopup");
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        (!mapPopup || !mapPopup.contains(event.target as Node))
      ) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Блокувати скрол сторінки
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Повернути скрол
    };
  }, []);

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Час має відповідати тривалості анімації CSS
  };

  return (
    <div className={`${s.popupOverlay} ${isClosing ? s.fadeOut : s.fadeIn}`}>
      <div className={s.wrapper}>
        <div ref={popupRef} className={s.popupContent}>
          <AddressTab user={user} />
          <div onClick={closePopup} className={s.closeBtn}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 13L13 39M13 13L39 39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
