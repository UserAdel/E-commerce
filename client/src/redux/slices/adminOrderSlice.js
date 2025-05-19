import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const deleteOrder = createAsyncThunk(
  "admin/updateOrderStatus",
  async (id, { rejectWithValue }) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



const adminOrderSlice =createSlice({
    name:"adminOrder",
    initialState:{
        orders:[],
        totalOrders:0,
        totalSales:0,
        loading:false,
        error:null, 
     },
     reducers:{ },
      extraReducers: (builder) => {
        builder
          // Fetch all orders
          .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders ;
            state.totalOrders = action.payload.length ;
            const totalSales=action.payload.reduce((acc, order) => {
              return acc + order.totalPrice;
            }
            , 0);
            state.totalSales = totalSales;
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
            const index = state.orders.findIndex(
              (order) => order._id === updatedOrder._id
            );
            if (index !== -1) {
              state.orders[index] = updatedOrder;
            }
          })
          .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })

          // Delete order
          .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter(
              (order) => order._id !== action.payload
            );
            state.totalOrders = state.totalOrders > 0 ? state.totalOrders - 1 : 0;
          })
          .addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
       },
});

export default adminOrderSlice.reducer;