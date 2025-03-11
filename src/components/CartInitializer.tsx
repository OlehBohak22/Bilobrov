import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchCart, mergeCart } from "../store/slices/cartSlice";
import { RootState } from "../store";

export const CartInitializer = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (token) {
      dispatch(mergeCart(token));
    } else {
      dispatch(fetchCart(null));
    }
  }, [token, dispatch]);

  return null; // Компонент не рендерить нічого
};
