import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllVendors,
  fetchVendorDetail,
  updateVendorStatus,
} from "../../services/adminVendor.api";

const initialState = {
  list: [],
  detail: null,
  loading: false,
  detailLoading: false,
  updating: false,
  error: null,
  detailError: null,
  isFetched: false,
};

export const fetchAllVendorsData = createAsyncThunk(
  "adminVendor/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllVendors();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const fetchVendorDetailData = createAsyncThunk(
  "adminVendor/fetchDetail",
  async (id, thunkAPI) => {
    try {
      const response = await fetchVendorDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateVendorStatusData = createAsyncThunk(
  "adminVendor/updateStatus",
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

const adminVendorSlice = createSlice({
  name: "adminVendor",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVendorsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVendorsData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isFetched = true;
        state.list = action.payload?.data ?? [];
      })
      .addCase(fetchAllVendorsData.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchVendorDetailData.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchVendorDetailData.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        state.detail = action.payload?.data ?? null;
      })
      .addCase(fetchVendorDetailData.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || "Something went wrong";
      })
      .addCase(updateVendorStatusData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateVendorStatusData.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        const updated = action.payload?.data;
        if (updated) {
          state.detail = updated;
          state.list = state.list.map((v) =>
            v._id === updated._id ? { ...v, ...updated } : v,
          );
        }
      })
      .addCase(updateVendorStatusData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError } = adminVendorSlice.actions;
export default adminVendorSlice.reducer;