import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVariantsByVendor,
  addVariantByVendor,
  updateVariantByVendor,
  deleteVariantByVendor,
} from "../../services/variant.api";

const initialState = {
  data: [],
  productId: null,
  loading: false,
  saving: false,
  error: null,
};

export const fetchVendorVariantsData = createAsyncThunk(
  "vendorVariant/fetchByProduct",
  async (productId, thunkAPI) => {
    try {
      const response = await fetchVariantsByVendor(productId);
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createVendorVariant = createAsyncThunk(
  "vendorVariant/create",
  async ({ data, productId }, thunkAPI) => {
    try {
      const response = await addVariantByVendor({ data, productId });
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateVendorVariantData = createAsyncThunk(
  "vendorVariant/update",
  async ({ data, productId, id }, thunkAPI) => {
    try {
      const response = await updateVariantByVendor({ data, productId, id });
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteVendorVariantData = createAsyncThunk(
  "vendorVariant/delete",
  async ({ productId, id }, thunkAPI) => {
    try {
      const response = await deleteVariantByVendor({ productId, id });
      return { ...response, productId, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const vendorVariantSlice = createSlice({
  name: "vendorVariant",
  initialState,
  reducers: {
    clearVendorVariantError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorVariantsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorVariantsData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.productId = action.payload.productId;
        state.data = action.payload.data;
      })
      .addCase(fetchVendorVariantsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createVendorVariant.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createVendorVariant.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data.unshift(action.payload.data);
      })
      .addCase(createVendorVariant.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVendorVariantData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateVendorVariantData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const updated = action.payload.data;
        const index = state.data.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        }
      })
      .addCase(updateVendorVariantData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteVendorVariantData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteVendorVariantData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data = state.data.filter((v) => v._id !== action.payload.id);
      })
      .addCase(deleteVendorVariantData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearVendorVariantError } = vendorVariantSlice.actions;
export default vendorVariantSlice.reducer;
