import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    const parsedCart = storedCart ? JSON.parse(storedCart) : { products: [] };
    console.log("Loaded cart from localStorage:", parsedCart);
    return parsedCart;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { products: [] };
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    console.log("Saving cart to localStorage:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId, guestId}, {rejectWithValue}) => {
  try {
    const token = JSON.parse(localStorage.getItem("UserToken"));
    console.log("Fetching cart with:", { 
      userId: userId?.toString(), 
      guestId,
      hasToken: !!token 
    });
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      params: {
        userId,
        guestId,
      },
      headers: token ? {
        "Authorization": `Bearer ${token}`
      } : {}
    });
    
    console.log("Fetch cart response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error.response?.data || error);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({productId, quantity, size, color, userId, guestId}, {rejectWithValue}) => {
  try {
    const token = JSON.parse(localStorage.getItem("UserToken"));
    console.log("Adding to cart:", { productId, quantity, size, color, userId, guestId });
    
    // First, try to merge cart if user is logged in and has guest items
    if (userId && guestId) {
      try {
        console.log("Attempting to merge guest cart with user cart");
        const mergeResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
          {
            guestId,
            userId
          },
          {
            headers: token ? {
              "Authorization": `Bearer ${token}`
            } : {}
          }
        );
        console.log("Cart merge successful:", mergeResponse.data);
      } catch (mergeError) {
        console.error("Error merging carts:", mergeError);
        // Continue with add to cart even if merge fails
      }
    }

    // Then add the new item
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      userId,
      guestId,
      productId,
      quantity,
      size,
      color,
    }, {
      headers: token ? {
        "Authorization": `Bearer ${token}`
      } : {}
    });

    console.log("Add to cart response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error);
    return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
  }
});

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token && userId) {
        return rejectWithValue("Authentication required for registered users");
      }

      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      // Ensure productId is a string and other fields are properly formatted
      const formattedProductId = productId?.toString();
      const formattedSize = size?.trim();
      const formattedColor = color?.trim();
      
      const requestData = {
        userId,
        guestId,
        productId: formattedProductId,
        quantity,
        size: formattedSize,
        color: formattedColor,
      };
      
      console.log("Updating cart quantity:", requestData);
      console.log("API URL:", `${import.meta.env.VITE_BACKEND_URL}/api/cart`);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        requestData,
        { 
          headers,
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        }
      );

      if (response.status === 404) {
        console.error("Cart not found. Creating new cart...");
        // If cart not found, try to create a new one
        const createResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
          requestData,
          { headers }
        );
        console.log("New cart created:", createResponse.data);
        return createResponse.data;
      }

      if (!response.data) {
        console.error("No data received from server");
        return rejectWithValue("No data received from server");
      }

      console.log("Update cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating cart quantity:", {
        error: error.response?.data || error,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      });
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to update item quantity"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      console.log("Removing from cart:", { productId, size, color, userId, guestId });
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          data: {
            userId,
            guestId,
            productId,
            size,
            color,
          },
          headers
        }
      );

      if (!response.data) {
        console.error("No data received from server");
        return rejectWithValue("No data received from server");
      }

      console.log("Remove from cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to remove item from cart"
      );
    }
  }
);

export const mergeCart = createAsyncThunk("cart/mergeCart", async ({guestId, user}, {rejectWithValue}) => {
  try {
    const token = JSON.parse(localStorage.getItem("UserToken"));
    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    if (!user || !user._id) {
      console.error("Invalid user object:", user);
      return rejectWithValue("Invalid user data");
    }

    console.log("Merging cart with:", { 
      guestId, 
      userId: user._id,
      userData: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, 
      {
        guestId,
        userId: user._id
      }, 
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.data) {
      console.error("No data received from server during merge");
      return rejectWithValue("No data received from server");
    }

    console.log("Merge response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Merge cart error:", {
      error: error.response?.data || error,
      user: user ? {
        id: user._id,
        email: user.email,
        name: user.name
      } : 'undefined'
    });
    return rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      "Failed to merge cart"
    );
  }
});

export const clearCartFromBackend = createAsyncThunk(
  "cart/clearCartFromBackend",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      console.log("Clearing cart for:", { userId, guestId });
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
        {
          data: { userId, guestId },
          headers
        }
      );
      
      if (!response.data) {
        console.error("No data received from server when clearing cart");
        return rejectWithValue("No data received from server");
      }

      console.log("Cart cleared successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error clearing cart from backend:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Update cart with new data from server
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
      })
      
      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        // Update cart with new data from server
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update item quantity";
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // Update cart with new data from server
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item from cart";
      })
      
      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        // Update cart with merged data from server
        state.cart = action.payload;
        state.loading = false;
        saveCartToLocalStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      })

      // Clear cart from backend
      .addCase(clearCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartFromBackend.fulfilled, (state) => {
        state.cart = { products: [] };
        state.loading = false;
        localStorage.removeItem("cart");
      })
      .addCase(clearCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;
