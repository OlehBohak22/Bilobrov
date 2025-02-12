import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/actions/userActions";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store"; // Імпортуємо RootState для useSelector
import styles from "./Register.module.css"; // Імпортуємо стилі
import { useEffect } from "react";

const RegisterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  const { error } = useSelector((state: RootState) => state.user); // Вибираємо стан авторизації

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && firstName) {
      dispatch(registerUser(email, password, firstName));
    } else {
      // setError("Заповніть всі поля!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <img src="/images/registration-img.png" alt="Registration" />

        <h2>Привіт, красуне!</h2>

        <p>
          Ми раді тебе вітати у просторі Bilobrov - давай створимо твій акаунт
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          <label htmlFor="email">
            Елекронна пошта<span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            className="mb-[1.2vw]"
            type="email"
            placeholder="Твоя електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="name">
            Твоє ім'я<span className="text-red-600">*</span>
          </label>

          <input
            id="name"
            className="mb-[1.2vw]"
            type="text"
            placeholder="Введи своє ім'я"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="password">
            Пароль<span className="text-red-600">*</span>
          </label>
          <input
            className="mb-[0.6vw]"
            id="password"
            type="password"
            placeholder="Введи пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span className={styles.min}>Мінімум 8 символів</span>

          <label htmlFor="password-rep">
            Повтори пароль<span className="text-red-600">*</span>
          </label>
          <input
            className="mb-[2vw]"
            id="password-rep"
            type="password"
            placeholder="Введи пароль ще раз"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.registerBtn} type="submit">
            <span>Зареєструватись</span>
            <svg
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_691_3833)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_691_3833">
                  <rect transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </form>

        <button onClick={onClose} className={styles.closeBtn}>
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
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user); // Вибираємо стан авторизації

  useEffect(() => {
    if (user) {
      setIsOpen(false);
    }
  }, [user]);

  return (
    <div className={styles.registerContainer}>
      <button onClick={() => setIsOpen(true)} className={styles.openBtn}>
        Відкрити реєстрацію
      </button>
      {isOpen && <RegisterModal onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default Register;
