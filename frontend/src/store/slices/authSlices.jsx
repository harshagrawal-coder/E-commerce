import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, login, register } from "../../services/api";
import { config } from "../../config/config";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await login(userData);
      localStorage.setItem(config.TOKEN_KEY, response.token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "somethings went wrong",
      );
    }
  },
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await register(userData);
      localStorage.setItem(config.TOKEN_KEY, response.token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, thunkAPI) => {
    try {
      const response = await getCurrentUser();
      return response;
    } catch (error) {
      localStorage.getItem(config.TOKEN_KEY);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "something went wrong";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "something went wrong";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Something went wrong";
        state.isInitialized = true;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
