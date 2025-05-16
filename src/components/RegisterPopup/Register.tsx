import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/actions/userActions";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store";
import s from "./Register.module.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { API_URL_WP } from "../../constants/api";
import { useNavigate } from "react-router";

const RegisterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<null | "success" | "error">(
    null
  );
  const [resetLoading, setResetLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetDone, setResetDone] = useState<"success" | "error" | null>(null);

  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

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
          navigate("/account");
        }
      } catch (err) {
        console.error("❌ Реєстрація помилка:", err);
      }
    } else {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
        navigate("/account");
      } catch (err) {
        console.error("❌ Логін помилка:", err);
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetLoading(true);
    setResetStatus(null);

    try {
      const res = await fetch(`${API_URL_WP}users_send_reset_mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setResetStatus("success");
        setResetToken(data.reset_token);
        setIsResettingPassword(true);
        console.log("✅ Token для зміни пароля:", data.reset_token);
      } else {
        setResetStatus("error");
      }
    } catch (err) {
      console.error("❌ Reset error:", err);
      setResetStatus("error");
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setResetDone("error");
      return;
    }

    setResetLoading(true);
    setResetDone(null);

    try {
      const res = await fetch(`${API_URL_WP}users_reset_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setResetDone("success");
      } else {
        setResetDone("error");
      }
    } catch (err) {
      console.error("❌ Set password error:", err);
      setResetDone("error");
    } finally {
      setResetLoading(false);
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
          {isForgotPassword ? (
            resetDone ? (
              <img
                className="lg:w-[6.6vw]! lg:m-0 mx-auto"
                src="/images/succes-pass.png"
                alt="Success"
              />
            ) : (
              <img className="lg:w-[6.6vw]! " src="/images/forgot.png" alt="" />
            )
          ) : (
            <img src="/images/registration-img.png" alt="" />
          )}
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
          {isForgotPassword ? (
            <>
              {!isResettingPassword ? (
                <>
                  <h2>{t("forgot.title")}</h2>
                  <p>{t("forgot.description")}</p>

                  <form onSubmit={handlePasswordReset} className={s.form}>
                    <label htmlFor="resetEmail">
                      {t("forgot.email")}
                      <span>*</span>
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      placeholder={t("forgot.emailPlaceholder")}
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="lg:mb-[2vw] mb-[8vw]"
                    />
                    {resetStatus === "error" && (
                      <p className={s.error}>{t("forgot.error")}</p>
                    )}

                    <button
                      className={s.registerBtn}
                      type="submit"
                      disabled={resetLoading}
                    >
                      {resetLoading ? t("forgot.loading") : t("forgot.send")}
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
                    <p
                      className={s.backLink}
                      onClick={() => setIsForgotPassword(false)}
                    >
                      <svg
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 17.5L3 12.5M3 12.5L8 7.5M3 12.5L15 12.5M15 3.5L16.2 3.5C17.8802 3.5 18.7202 3.5 19.362 3.82698C19.9265 4.1146 20.3854 4.57354 20.673 5.13803C21 5.77976 21 6.61984 21 8.3V16.7C21 18.3802 21 19.2202 20.673 19.862C20.3854 20.4265 19.9265 20.8854 19.362 21.173C18.7202 21.5 17.8802 21.5 16.2 21.5H15"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t("forgot.back")}
                    </p>
                  </div>
                </>
              ) : resetDone === "success" ? (
                <div className={s.successResetWrapper}>
                  <h2 className={`${s.successTitle} lg:text-left  text-center`}>
                    {t("forgot.resetSuccessTitle")}
                  </h2>
                  <p
                    className={`${s.successText} border-b border-[#e7e7e7] lg:pb-[2vw] pb-[5.3vw] lg:text-left  text-center`}
                  >
                    {t("forgot.resetSuccessDescription")}
                  </p>

                  <div className={s.divider}></div>
                  <button onClick={onClose} className={s.registerBtn}>
                    {t("forgot.goToShop")}
                    <svg
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.4177 5.5L16.3487 6.55572L21.1059 11.2535H0V12.7465H21.1059L16.3487 17.4443L17.4177 18.5L24 12L17.4177 5.5Z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <h2>{t("forgot.resetTitle")}</h2>
                  <p>{t("forgot.resetDescription")}</p>

                  <form onSubmit={handleSetNewPassword} className={s.form}>
                    <label htmlFor="newPassword">
                      {t("forgot.newPassword")}
                      <span>*</span>
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder={t("forgot.newPasswordPlaceholder")}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="lg:mb-[1.2vw] mb-[5.3vw]"
                    />

                    <label htmlFor="confirmPassword">
                      {t("forgot.confirmPassword")}
                      <span>*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder={t("forgot.confirmPasswordPlaceholder")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="lg:mb-[2vw] mb-[8vw]"
                    />

                    {resetDone === "error" && (
                      <p className={s.error}>{t("forgot.resetError")}</p>
                    )}

                    <button
                      className={s.registerBtn}
                      type="submit"
                      disabled={resetLoading}
                    >
                      {resetLoading
                        ? t("forgot.loading")
                        : t("forgot.setNewPassword")}
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
                    <p
                      className={s.backLink}
                      onClick={() => setIsForgotPassword(false)}
                    >
                      <svg
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 17.5L3 12.5M3 12.5L8 7.5M3 12.5L15 12.5M15 3.5L16.2 3.5C17.8802 3.5 18.7202 3.5 19.362 3.82698C19.9265 4.1146 20.3854 4.57354 20.673 5.13803C21 5.77976 21 6.61984 21 8.3V16.7C21 18.3802 21 19.2202 20.673 19.862C20.3854 20.4265 19.9265 20.8854 19.362 21.173C18.7202 21.5 17.8802 21.5 16.2 21.5H15"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t("forgot.back")}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h2>
                {isRegister
                  ? t("register.welcomeTitle")
                  : t("register.loginTitle")}
              </h2>
              <p>
                {isRegister
                  ? t("register.welcomeText")
                  : t("register.loginText")}
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

                {!isRegister && (
                  <button
                    className={s.forgotPasswordLink}
                    onClick={() => {
                      setIsForgotPassword(true);
                      setResetStatus(null);
                      setIsResettingPassword(false);
                    }}
                  >
                    {t("forgot.title")}
                  </button>
                )}

                {error && <p className={s.error}>{error}</p>}
                <button
                  className={`${s.registerBtn} ${
                    !email || !password || (isRegister && !firstName)
                      ? s.disabled
                      : ""
                  }`}
                  type="submit"
                  disabled={
                    loading || !email || !password || (isRegister && !firstName)
                  }
                >
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
                {isRegister
                  ? t("register.haveAccount")
                  : t("register.noAccount")}
                <button onClick={() => setIsRegister(!isRegister)}>
                  {isRegister
                    ? t("register.switchToLogin")
                    : t("register.switchToRegister")}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterModal;
