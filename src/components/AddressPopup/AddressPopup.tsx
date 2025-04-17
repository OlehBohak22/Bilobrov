import { UserData } from "../../store/slices/userSlice";
import { AddressTab } from "../AddressTab/AddressTab";
import { useEffect, useRef } from "react";
import s from "./AddressPopup.module.css";

interface AddressPopupProps {
  user: UserData | null;
  onClose: () => void;
}

export const AddressPopup = ({ user, onClose }: AddressPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={s.popupOverlay}>
      <div className={s.wrapper}>
        <div ref={popupRef} className={s.popupContent}>
          <AddressTab user={user} />
          <div onClick={onClose} className={s.closeBtn}>
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
