import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

// Async thunks
export const fetchAdminProducts = createAsyncThunk(
  "adminProduct/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "adminProduct/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      console.log('Token being sent:', token);
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Add product error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;