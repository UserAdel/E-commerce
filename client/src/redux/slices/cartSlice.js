import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : {products:[]};
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};



export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId,guestId},{rejectWithValue}) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/`, {
      params: {
        userId,
        guestId,
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});


export const addToCart = createAsyncThunk("cart/addToCart", async ({productId,quantity,size,color,userId,guestId},{rejectWithValue}) =>{
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      userId,
      guestId,
      productId,
      quantity,
      size,
      color,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});



export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({productId,quantity,size,color,userId,guestId},{rejectWithValue}) =>{
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      userId,
      guestId,
      productId,
      quantity,
      size,
      color,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});


export const removeFromCart=createAsyncThunk("cart/removeFromCart", async ({productId,size,color,userId,guestId},{rejectWithValue}) =>{
  try {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      data: {
        userId,
        guestId,
        productId,
        size,
        color,
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});


export const mergeCart=createAsyncThunk("cart/mergeCart", async ({guestId,user},{rejectWithValue}) =>{
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, {
      guestId,
      user
    }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = {products:[]}; 
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      saveCartToLocalStorage(action.payload);

    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch cart";
    });

    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      saveCartToLocalStorage(action.payload);

    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message|| "Failed to fetch cart";
    });
    
    builder.addCase(updateCartItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      saveCartToLocalStorage(action.payload);

    });
    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message|| "Failed to update item quanity";
    });
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      saveCartToLocalStorage(action.payload);

    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message|| "Failed to remove item from cart";
    });
    
    builder.addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(mergeCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      saveCartToLocalStorage(action.payload);

    });
    builder.addCase(mergeCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message|| "Failed to merge cart";
    });
  },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;
