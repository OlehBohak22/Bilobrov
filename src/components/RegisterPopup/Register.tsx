import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/actions/userActions";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store";
import s from "./Register.module.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const RegisterModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);

  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isRegister && !firstName)) {
      return;
    }

    if (isRegister) {
      try {
        const result = await dispatch(
          registerUser({ email, password, name: firstName })
        ).unwrap();

        if (result) {
          onClose();
        }
      } catch (err) {
        console.error("❌ Реєстрація помилка:", err);
      }
    } else {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
      } catch (err) {
        console.error("❌ Логін помилка:", err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={s.modalOverlay}
    >
      <motion.div
        className={s.before}
        initial={{ x: "300%" }}
        animate={{ x: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: 0.3,
        }}
        exit={{
          x: "500%",
          transition: { duration: 0.5, ease: "easeOut", delay: 0 },
        }}
      >
        <img src="/images/popup-side-img.avif" alt="before" />
      </motion.div>
      <motion.div
        ref={modalRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={s.modal}
      >
        <div>
          <img src="/images/registration-img.png" alt="" />
        </div>

        <button onClick={onClose} className={s.closeBtn}>
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
        </button>

        <div className={s.content}>
          <h2>
            {isRegister ? t("register.welcomeTitle") : t("register.loginTitle")}
          </h2>
          <p>
            {isRegister ? t("register.welcomeText") : t("register.loginText")}
          </p>

          <form onSubmit={handleSubmit} className={s.form}>
            <label htmlFor="email">
              {t("register.email")}
              <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lg:mb-[1.2vw] mb-[5.3vw]"
            />

            {isRegister && (
              <>
                <label htmlFor="name">
                  {t("register.name")} <span>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t("register.namePlaceholder")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="lg:mb-[1.2vw] mb-[5.3vw]"
                />
              </>
            )}

            <label htmlFor="password">
              {t("register.password")}
              <span>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="lg:mb-[2vw] mb-[8vw]"
            />

            {error && <p className={s.error}>{error}</p>}
            <button className={s.registerBtn} type="submit" disabled={loading}>
              {loading
                ? t("register.loading")
                : isRegister
                ? t("register.registerButton")
                : t("register.loginButton")}
              <svg
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.4177 5.5L16.3487 6.55572L21.1059 11.2535H0V12.7465H21.1059L16.3487 17.4443L17.4177 18.5L24 12L17.4177 5.5Z" />
              </svg>
            </button>
          </form>

          <div className={s.controller}>
            {isRegister ? t("register.haveAccount") : t("register.noAccount")}
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? t("register.switchToLogin")
                : t("register.switchToRegister")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
