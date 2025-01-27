import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/actions/userActions";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && firstName && lastName && phone) {
      dispatch(registerUser(email, password, firstName, lastName, phone));
    } else {
      setError("Заповніть всі поля!");
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
      <input
        type="text"
        placeholder="Прізвище"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Зареєструватися</button>
    </form>
  );
};

export default Register;
