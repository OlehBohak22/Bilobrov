import { useSelector } from "react-redux";
import s from "./HeaderUserSettings.module.css";
import { RootState } from "../../store";

interface HeaderProps {
  openRegister: React.Dispatch<React.SetStateAction<boolean>>;
  openWishList: React.Dispatch<React.SetStateAction<boolean>>;
  openCart: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

export const HeaderUserSettings: React.FC<HeaderProps> = ({
  openRegister,
  openWishList,
  openCart,
  isMobile,
}) => {
  const wishlist = useSelector(
    (state: RootState) => state.wishlist.preferences
  );

  const cart = useSelector((state: RootState) => state.cart || []);

  return (
    <div className={s.userSettings}>
      {!isMobile && (
        <button onClick={() => openRegister(true)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <button
        className={!wishlist.length ? s.disabled : ""}
        onClick={() => openWishList(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {wishlist?.length > 0 && (
          <span className={s.qty}>{wishlist?.length}</span>
        )}
      </button>

      <button
        className={!cart?.items?.length ? s.disabled : ""}
        onClick={() => openCart(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.50014 17H17.3294C18.2793 17 18.7543 17 19.1414 16.8284C19.4827 16.6771 19.7748 16.4333 19.9847 16.1246C20.2228 15.7744 20.3078 15.3071 20.4777 14.3724L21.8285 6.94311C21.8874 6.61918 21.9169 6.45721 21.8714 6.33074C21.8315 6.21979 21.7536 6.12651 21.6516 6.06739C21.5353 6 21.3707 6 21.0414 6H5.00014M2 2H3.3164C3.55909 2 3.68044 2 3.77858 2.04433C3.86507 2.0834 3.93867 2.14628 3.99075 2.22563C4.04984 2.31565 4.06876 2.43551 4.10662 2.67523L6.89338 20.3248C6.93124 20.5645 6.95016 20.6843 7.00925 20.7744C7.06133 20.8537 7.13493 20.9166 7.22142 20.9557C7.31956 21 7.44091 21 7.6836 21H19"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {cart.items.length > 0 && (
          <span className={s.qty}>{cart?.items?.length}</span>
        )}
      </button>
    </div>
  );
};
