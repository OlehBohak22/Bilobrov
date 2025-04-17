import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/actions/userActions";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store";
import s from "./Register.module.css";
import { useRef } from "react";

import { motion } from "framer-motion";

export const RegisterModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isRegister, setIsRegister] = useState(true); // Стан для перемикання між формами

  const modalRef = useRef<HTMLDivElement>(null);

  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isRegister && !firstName)) {
      // Можна зробити вивід помилки в інтерфейсі замість alert
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
        onClose(); // Якщо клік був за межами модалки — закриваємо
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={s.modalOverlay}>
      <motion.div
        className={s.before}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <img src="/images/popup-side-img.avif" alt="before" />
      </motion.div>
      <motion.div
        ref={modalRef}
        initial={{ x: "50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
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
          <h2>{isRegister ? "Привіт, красуне!" : "З поверненням!"}</h2>
          <p>
            {isRegister
              ? "Ми раді тебе вітати у просторі Bilobrov - давай створимо твій акаунт"
              : "Ми раді тебе знов бачити у просторі Bilobrov. Бажаємо приємних покупок!"}
          </p>

          <form onSubmit={handleSubmit} className={s.form}>
            <label htmlFor="email">
              Електронна пошта<span>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Твоя електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-[1.2vw]"
            />

            {isRegister && (
              <>
                <label htmlFor="name">
                  Твоє ім'я <span>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Введи своє ім'я"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mb-[1.2vw]"
                />
              </>
            )}

            <label htmlFor="password">
              Пароль<span>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введи пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-[2vw]"
            />

            {error && <p className={s.error}>{error}</p>}
            <button className={s.registerBtn} type="submit" disabled={loading}>
              {loading
                ? "Зачекайте..."
                : isRegister
                ? "Зареєструватись"
                : "Увійти"}
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
            {isRegister ? "Вже є акаунт? " : "Ще немає акаунта? "}
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? " Увійти" : " Зареєструватись"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
