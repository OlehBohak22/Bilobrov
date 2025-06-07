import { Link } from "react-router";
import s from "./BackLink.module.css";

export const BackLink = () => {
  return (
    <Link className={s.backLink} to="/account#main">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.38819 3.33203L5.10088 4.03585L1.92942 7.1677H16V8.16306H1.92942L5.10088 11.2949L4.38819 11.9987L9.53674e-07 7.66535L4.38819 3.33203Z"
          fill="#1A1A1A"
        />
      </svg>

      <span>Назад</span>
    </Link>
  );
};
