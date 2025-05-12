import { configStore } from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";


const store = configStore({
  reducer: {
    auth: authReducer,
  },
});
