import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVendorProducts,
  addVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} from "../../services/vendorProduct.api";

const initialState = {
  data: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchVendorProductData = createAsyncThunk(
  "vendorProduct/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetchVendorProducts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createVendorProduct = createAsyncThunk(
  "vendorProduct/create",
  async (data, thunkAPI) => {
    try {
      const response = await addVendorProduct(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateVendorProductData = createAsyncThunk(
  "vendorProduct/update",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateVendorProduct({ data, id });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteVendorProductData = createAsyncThunk(
  "vendorProduct/delete",
  async (id, thunkAPI) => {
    try {
      const response = await deleteVendorProduct(id);
      return { ...response, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const vendorProductSlice = createSlice({
  name: "vendorProduct",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data ?? [];
      })
      .addCase(fetchVendorProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createVendorProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data.unshift(action.payload.data.product);
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVendorProductData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateVendorProductData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const updated = action.payload.data;
        const index = state.data.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        }
      })
      .addCase(updateVendorProductData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteVendorProductData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteVendorProductData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data = state.data.filter((p) => p._id !== action.payload.id);
      })
      .addCase(deleteVendorProductData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError } = vendorProductSlice.actions;
export default vendorProductSlice.reducer;