import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleWishlistItem } from "../../store/slices/wishlistSlice"; // новий локальний екшен
import s from "./WishListBtn.module.css";

interface WishlistButtonProps {
  productId: number;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const dispatch = useDispatch();

  const preferences = useSelector(
    (state: RootState) => state.wishlist.preferences
  );

  const isInWishlist = preferences.includes(productId);

  const handleToggle = () => {
    dispatch(toggleWishlistItem(productId));
  };

  return (
    <div className={s.wishList} onClick={handleToggle}>
      <svg
        viewBox="0 0 25 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isInWishlist ? s.active : ""}`}
      >
        <path
          d="M11.8701 21.7964C11.9329 21.8608 12.0081 21.912 12.091 21.947C12.174 21.982 12.2631 22 12.3532 22C12.4432 22 12.5324 21.982 12.6153 21.947C12.6983 21.912 12.7734 21.8608 12.8363 21.7964L21.5161 13.0016C23.7698 10.719 23.7698 7.00337 21.5161 4.71987C20.4214 3.61069 18.9657 3.00001 17.416 3.00001C15.8662 3.00001 14.4114 3.61069 13.3167 4.71897L12.3532 5.69606L11.3897 4.71987C10.8557 4.17416 10.218 3.74084 9.51393 3.44546C8.80991 3.15009 8.05388 2.99863 7.2904 3.00001C6.52678 2.99856 5.7706 3.14998 5.06642 3.44536C4.36224 3.74074 3.72431 4.17409 3.19023 4.71987C0.936589 7.00337 0.936589 10.719 3.19023 13.0007L11.8701 21.7964Z"
          fill={isInWishlist ? "#D63D44" : "none"}
        />
      </svg>
    </div>
  );
};

export default WishlistButton;
