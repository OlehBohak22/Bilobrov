// components/ConfirmLogoutModal/ConfirmLogoutModal.tsx

import { AnimatePresence, motion } from "framer-motion";
import s from "./ConfirmLogoutModal.module.css";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  titleText: string;
  descText: string;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  titleText,
  descText,
}) => {
  // if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={s.overlay}>
          <motion.div
            initial={{ transform: "scale(0)" }}
            animate={{ transform: "scale(1)" }}
            exit={{ transform: "scale(0)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={s.modal}
          >
            <div onClick={onCancel} className={s.onClose}>
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39 13L13 39M13 13L39 39"
                  stroke-width="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <img src="/images/registration-img.png" alt="Account" />
            <h3>{titleText}</h3>
            <p>{descText}</p>
            <div className={s.buttons}>
              <button className={s.confirm} onClick={onCancel}>
                {cancelText}
              </button>
              <button className={s.cancel} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
