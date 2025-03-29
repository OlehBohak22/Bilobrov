import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Прокручуємо сторінку в верх
  }, [location]); // Прокручувати кожен раз, коли змінюється location (маршрут)

  return null;
};

export default ScrollToTop;
