import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import prodctReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: prodctReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    admin: adminReducer,
    adminProduct: adminProductReducer,
  },
});

export default store;
