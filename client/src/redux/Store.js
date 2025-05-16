import { configStore } from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {prodctReducer}from "./slices/productSlice";
import {cartReducer} from "./slices/cartSlice";


const store = configStore({
  reducer: {
    auth: authReducer,
    product:prodctReducer,
    cart:cartReducer,
  },
});
