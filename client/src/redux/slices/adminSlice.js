import {
    createSlice,
    createAsyncThunk,
  } from "@reduxjs/toolkit";
  import axios from "axios";


  export const fetchUsers = createAsyncThunk("admin/fetchUsers",async(_,{})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,{
            headers:{
                authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
  });

export const addUser = createAsyncThunk("admin/updateUserRole",async(userData,{rejectWithValue})=>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,userData,{
        headers:{
            authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
    })
    return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
});


export const updateUser = createAsyncThunk("admin/updateUser",async({id,name,email,role},{rejectWithValue})=>{
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/${id}`,{name,email,role},{
      headers:{
          authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
  })
  return response.data.user;
  } catch (error) {
      return rejectWithValue(error.response.data.message)
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser",async({id},{rejectWithValue})=>{
  try {
    const response= await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/${id}`,{
      headers:{
        authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
    return id

  } catch (error) {
    return rejectWithValue(error.response.data.message) 
  }
});


const adminSlice = createSlice({
name:"admin",
initialState:{
  users:[],
  loading:false,
  error:null
},reducers:{},
extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })

    
    .addCase(addUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload.user);
    })
    .addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })


    .addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload;
      const userIndex = state.users.findIndex((user) => user._id === updatedUser._id);
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })


    .addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });


},

})

export default adminSlice.reducer;

