import {
    createSlice,
    createAsyncThunk,
  } from "@reduxjs/toolkit";
  import axios from "axios";

  export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
      try {
        const token = JSON.parse(localStorage.getItem("UserToken"));
        if (!token) {
          return rejectWithValue("Authentication token not found");
        }
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create order");
      }
    }
  );

  export const fetchUserOrders = createAsyncThunk(
    "order/fetchUserOrders",
    async (_, { rejectWithValue }) => {
      try {
        const token = JSON.parse(localStorage.getItem("UserToken"));
        if (!token) {
          return rejectWithValue("Authentication token not found");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Fetch orders error:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
      }
    }
  );

  export const fetchOrdersDetails = createAsyncThunk(
    "order/fetchOrdersDetails",
    async (orderId, { rejectWithValue }) => {
      try {
        const token = JSON.parse(localStorage.getItem("UserToken"));
        if (!token) {
          return rejectWithValue("Authentication token not found");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
      }
    }
  );

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderState: (state) => {
            state.orders = [];
            state.orderDetails = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = [action.payload, ...state.orders];
                state.totalOrders += 1;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrdersDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrdersDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
