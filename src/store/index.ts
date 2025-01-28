import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productsSlice"; // Узгоджена назва
import bannerReducer from "./slices/bannerSlice";
import brandsReducer from "./slices/popularBrandsSlice";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    banner: bannerReducer,
    brands: brandsReducer,
    user: userReducer,
    auth: authReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
