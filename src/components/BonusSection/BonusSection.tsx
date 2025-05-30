import { Layout } from "../Layout/Layout";
import s from "./BonusSection.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";

export const BonusSection = ({
  openRegister,
}: {
  openRegister: () => void;
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  return (
    <section className={s.section}>
      <Layout className={s.container}>
        <div>
          <h2>
            <span>{t("bonusSection.title1")}</span>
            <span>{t("bonusSection.title2")}</span>
          </h2>

          <p>{t("bonusSection.description")}</p>

          <div className={s.bonus}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.2575 5H15C16.137 5.89336 17.1476 7.10385 18.4371 7.45673C18.9947 7.34952 19.6742 6.65718 20.3103 7.04132C20.9463 7.42546 20.7197 8.35008 20.894 8.90843C21.2904 9.33277 22.2009 9.59631 22.2009 10.3601C22.1987 10.4882 22.1717 10.6145 22.1216 10.7318C22.0715 10.8491 21.9993 10.9551 21.909 11.0436L24 13V6.78671C24 6.31285 23.8164 5.85839 23.4896 5.52332C23.1629 5.18824 22.7196 5 22.2575 5Z"
                fill="#FFC43A"
              />
              <path
                d="M21.1921 11.7944C21.2019 12.1475 21.1359 12.4978 21 12.8133L24 16V13.6302C23.493 13.1005 22.0294 11.5566 21.5032 11C21.1844 11.1975 21.219 11.386 21.1921 11.7944Z"
                fill="#FFC43A"
              />
              <path
                d="M18.5271 12.8788C17.9828 12.9852 17.3056 13.6407 16.6885 13.2747C16.0714 12.9086 16.2856 12.0233 16.1099 11.4955C15.9845 11.3689 15.8399 11.2626 15.6814 11.1805C14.9528 10.8059 14.4428 10.0057 15.2271 9.3672L9.99853 5H1.71428C1.25962 5 0.82359 5.17938 0.5021 5.49868C0.180611 5.81798 0 6.25105 0 6.70261V18.2974C0 18.7489 0.180611 19.182 0.5021 19.5013C0.82359 19.8206 1.25962 20 1.71428 20H22.2856C22.7403 20 23.1763 19.8206 23.4978 19.5013C23.8193 19.182 23.9999 18.7489 23.9999 18.2974V17.1822L19.7828 13.3513C19.3628 13.3087 18.8913 12.9257 18.5271 12.8788ZM9.67281 14.6538C9.11567 16.1351 7.0714 17.0289 6.67283 17.1226C6.24426 17.0289 4.20855 16.1351 3.67284 14.6538C3.24427 13.6535 4.28141 12.334 5.12141 12.3127C5.68371 12.2727 6.241 12.441 6.68569 12.7852C7.13094 12.4421 7.6878 12.2739 8.24996 12.3127C9.05996 12.334 10.0842 13.6578 9.67281 14.6538Z"
                fill="#FFC43A"
              />
              <path
                d="M16.1661 9.69072C15.7603 9.9625 15.7789 10.4294 16.1888 10.6948C16.412 10.8393 16.6216 10.9962 16.7246 11.1856C16.815 11.352 16.8531 11.5664 16.8773 11.7894C16.9336 12.3084 17.3784 12.5253 17.8598 12.3231C18.0803 12.2304 18.3024 12.1609 18.5 12.1682C18.6958 12.1754 18.9117 12.2513 19.1299 12.3434C19.6224 12.5513 20.0359 12.2625 20.1056 11.7326C20.1328 11.526 20.1814 11.3316 20.28 11.1856C20.4708 10.9255 20.7236 10.7129 21.0175 10.5656C21.3248 10.4044 21.3114 10.0153 21.0164 9.83244C20.7272 9.65317 20.4144 9.46877 20.28 9.21621C20.1905 9.04812 20.1516 8.8358 20.1268 8.61585C20.0681 8.09579 19.6241 7.87609 19.1418 8.07931C18.9225 8.17172 18.701 8.24095 18.5 8.23368C18.2907 8.2261 18.0721 8.15283 17.8514 8.06158C17.3689 7.86205 16.9508 8.11696 16.8979 8.63643C16.8754 8.85764 16.8312 9.06718 16.7246 9.21621C16.6004 9.38989 16.3866 9.54302 16.1661 9.69072Z"
                fill="#FFC43A"
              />
              <path
                d="M15.7565 8.29879C15.7456 7.9336 15.8298 7.5722 16 7.25358C15.3913 6.71996 14.0311 5.5204 13.4307 5H11L15.5382 9C15.7775 8.84564 15.7271 8.61632 15.7565 8.29879Z"
                fill="#FFC43A"
              />
              <path
                d="M7.92269 13.259C7.53364 13.2721 7.16303 13.441 6.883 13.7327C6.81139 13.8064 6.71624 13.8475 6.6173 13.8475C6.51836 13.8475 6.42322 13.8064 6.3516 13.7327C6.07209 13.4376 5.69902 13.2683 5.30806 13.259C5.07393 13.3275 4.8736 13.4915 4.74932 13.7163C4.62504 13.9411 4.58652 14.2092 4.64189 14.464C4.87679 15.2452 6.032 15.964 6.6173 16.259C7.19876 15.964 8.35782 15.2452 8.59271 14.464C8.64794 14.2086 8.60889 13.94 8.48384 13.7151C8.35878 13.4902 8.15754 13.3266 7.92269 13.259Z"
                fill="#FFC43A"
              />
            </svg>

            <span>{t("bonusSection.bonusNote")}</span>
          </div>

          {!user && (
            <button onClick={openRegister}>
              <span>{t("bonusSection.register")}</span>
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
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}
        </div>

        <div className={s.imageContainer}>
          <img src="/images/bonusImage.avif" alt="Bonus" />
        </div>
      </Layout>
    </section>
  );
};
