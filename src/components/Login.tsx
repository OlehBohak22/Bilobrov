import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/actions/userActions"; // Імпорт екшену
import { AppDispatch, RootState } from "../store"; // Типи для селектора

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { loading, error } = useSelector((state: RootState) => state.auth); // Вибираємо стан авторизації

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Будь ласка, заповніть усі поля");
      return;
    }
    dispatch(loginUser(email, password));
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Авторизація</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Електронна пошта
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введіть вашу пошту"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введіть ваш пароль"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button type="submit" className="w-full" disabled={loading}>
          {loading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
};
