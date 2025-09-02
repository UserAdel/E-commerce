import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        console.error("No token found in localStorage");
        return rejectWithValue("Authentication token not found");
      }

      console.log("Fetching orders with token:", token);
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Orders response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in fetchAllOrders:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      // Ensure status is lowercase
      const lowercaseStatus = status.toLowerCase();

      const response = await axios.put(
        `${API_URL}/orders/${orderId}`,
        { status: lowercaseStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;