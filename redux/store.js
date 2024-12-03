import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import ordersReducer from "./features/orders/ordersSlice";
import productsReducer from "./features/products/productsSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
});
