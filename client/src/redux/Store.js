import { configStore } from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {prodctReducer}from "./slices/productSlice";



const store = configStore({
  reducer: {
    auth: authReducer,
    product:prodctReducer,
  },
});
