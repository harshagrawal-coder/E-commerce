import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVendor,
  createVendor,
  updateVendor,
  updateVendorStatus,
} from "../../services/vendor.api";

const initialState = {
  data: null,
  loading: false,
  updating: false,
  error: null,
  isFetched: false,
};

export const fetchVendorData = createAsyncThunk(
  "vendor/fetchVendor",
  async (_, thunkAPI) => {
    try {
      const response = await fetchVendor();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createVendorProfile = createAsyncThunk(
  "vendor/createVendor",
  async (data, thunkAPI) => {
    try {
      const response = await createVendor(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const updateVendorProfile = createAsyncThunk(
  "vendor/updateVendor",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateVendor(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const updateVendorStatusData = createAsyncThunk(
  "vendor/updateVendorStatus",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateVendorStatus(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetVendor(state) {
      state.data = null;
      state.loading = false;
      state.updating = false;
      state.error = null;
      state.isFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isFetched = true;
        state.data = action.payload.data;
      })
      .addCase(fetchVendorData.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createVendorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(createVendorProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(createVendorProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVendorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateVendorProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        state.data = { ...state.data, ...action.payload.data };
      })
      .addCase(updateVendorProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVendorStatusData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateVendorStatusData.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        state.data = { ...state.data, ...action.payload.data };
      })
      .addCase(updateVendorStatusData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError, resetVendor } = vendorSlice.actions;
export default vendorSlice.reducer;