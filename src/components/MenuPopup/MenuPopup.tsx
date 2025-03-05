import { motion } from "framer-motion";
import s from "./MenuPopup.module.css";

export const MenuPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className={s.modalOverlay}>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={s.modal}
      >
        <div className={s.menuHeader}>
          <p>Меню</p>
          <button onClick={onClose}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 13L13 39M13 13L39 39"
                stroke-Width="2"
                stroke-Linecap="round"
                stroke-Linejoin="round"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
