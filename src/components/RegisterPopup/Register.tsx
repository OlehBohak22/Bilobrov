import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/actions/userActions";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store"; // Імпортуємо RootState для useSelector
import styles from "./Register.module.css"; // Імпортуємо стилі

const RegisterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth); // Вибираємо стан авторизації

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

        <h2 className="mb-[2vw]">Привіт, красуне!</h2>

        <p>
          Ми раді тебе вітати у просторі Bilobrov - давай створимо твій акаунт
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          <label>Елекронна пошта</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ім'я"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}
          <button
            type="submit"
            className={styles.registerBtn}
            disabled={loading}
          >
            {loading ? "Зачекайте..." : "Зареєструватися"}
          </button>
        </form>
        <button onClick={onClose} className={styles.closeBtn}>
          Закрити
        </button>
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
