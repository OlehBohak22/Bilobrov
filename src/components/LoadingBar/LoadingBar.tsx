import s from "./LoadingBar.module.css"; // Додамо стилі для анімації

const LoadingBar = () => {
  return (
    <div className={s.loadingBar}>
      <div className={s.loadingBarProgress}></div>
    </div>
  );
};

export default LoadingBar;
