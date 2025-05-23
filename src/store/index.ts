import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productsSlice"; // Узгоджена назва
import bannerReducer from "./slices/bannerSlice";
import brandsReducer from "./slices/popularBrandsSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import faqReducer from "./slices/faqSlice";
import contactReducer from "./slices/contactSlice";
import wishlistReducer from "./slices/wishlistSlice";
import resetPasswordReducer from "./slices/resetPasswordSlice";
import cartReducer from "./slices/cartSlice";
import menuReducer from "./slices/menuSlice";
import filtersReducer from "./slices/filterSlice";
import orderReducer from "./slices/orderSlice";
import citiesReducer from "./slices/citiesSlice";
import addressReducer from "./slices/addressSlice";

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
    resetPassword: resetPasswordReducer,
    cart: cartReducer,
    menu: menuReducer,
    filters: filtersReducer,
    order: orderReducer,
    cities: citiesReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
