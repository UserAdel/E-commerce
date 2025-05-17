import {
    createSlice,
    createAsyncThunk,
  } from "@reduxjs/toolkit";
  import axios from "axios";


  export const createOrder = createAsyncThunk("order/fetchOrders",async(_,{rejectWithValue})=>{
    try {
      const response = await axios.get(`${VITE_VITE_BACKEND_URL}/api/orders/my-orders`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
      });
      return response.data;

    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  });

  export const fetchOrdersDetails = createAsyncThunk("order/fetchOrdersDetails",async(orderId, {rejectWithValue})=>{

    try {
        const response = await axios.get(`${VITE_VITE_BACKEND_URL}/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error?.response?.data);
      }
  })

const orderSlice = createSlice({
    name:"order",
    initialState:{
        orders:[],
        totalOrders:0,
        orderDetails:null,
        loading:false,
        error:null,
    },
    reducers:{ },
    extraReducers:(builder)=>{
        builder.addCase(createOrder.pending,(state)=>{
          state.loading=true;
          state.error=null;
        })
        builder.addCase(createOrder.fulfilled,(state,action)=>{
          state.loading=false;
          state.orders=action.payload;
        })
        builder.addCase(createOrder.rejected,(state,action)=>{ 
          state.loading=false;
          state.error=action.payload.message ;
        })


        builder.addCase(fetchOrdersDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;
          })
          builder.addCase(fetchOrdersDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.orderDetails=action.payload;
          })
          builder.addCase(fetchOrdersDetails.rejected,(state,action)=>{ 
            state.loading=false;
            state.error=action.payload.message ;
          })
  


      }

})

export default orderSlice.reducer
