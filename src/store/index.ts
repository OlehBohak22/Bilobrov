import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productsSlice"; // Узгоджена назва
import bannerReducer from "./slices/bannerSlice";
import brandsReducer from "./slices/popularBrandsSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import faqReducer from "./slices/faqSlice";
import contactReducer from "./slices/contactSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    banner: bannerReducer,
    brands: brandsReducer,
    user: userReducer,
    categories: categoryReducer,
    faq: faqReducer,
    contact: contactReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
