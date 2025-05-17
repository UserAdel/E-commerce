import { configStore } from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {prodctReducer}from "./slices/productSlice";
import {cartReducer} from "./slices/cartSlice";
import {checkoutReducer} from "./slices/checkoutSlice";
import {orderReducer} from "./slices/orderSlice"
const store = configStore({
  reducer: {
    auth: authReducer,
    product:prodctReducer,
    cart:cartReducer,
    checkout:checkoutReducer
    order:orderReducer,
  },
});
