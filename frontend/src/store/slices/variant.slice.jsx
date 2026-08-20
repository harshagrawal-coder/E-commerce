import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchVariantsByProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  fetchPendingVariants,
  fetchAllPendingVariants,
  updateVariantStatus,
} from "../../services/variant.api";

const initialState = {
  data: [],
  pendingData: [],
  productId: null,
  loading: false,
  saving: false,
  updating: false,
  error: null,
};

export const fetchVariantsData = createAsyncThunk(
  "variant/fetchByProduct",
  async (productId, thunkAPI) => {
    try {
      const response = await fetchVariantsByProduct(productId);
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createVariant = createAsyncThunk(
  "variant/create",
  async ({ data, productId }, thunkAPI) => {
    try {
      const response = await addVariant({ data, productId });
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateVariantData = createAsyncThunk(
  "variant/update",
  async ({ data, productId, id }, thunkAPI) => {
    try {
      const response = await updateVariant({ data, productId, id });
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteVariantData = createAsyncThunk(
  "variant/delete",
  async ({ productId, id }, thunkAPI) => {
    try {
      const response = await deleteVariant({ productId, id });
      return { ...response, productId, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const fetchPendingVariantsData = createAsyncThunk(
  "variant/fetchPending",
  async (productId, thunkAPI) => {
    try {
      const response = await fetchPendingVariants(productId);
      return { ...response, productId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const fetchAllPendingVariantsData = createAsyncThunk(
  "variant/fetchAllPending",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllPendingVariants();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateVariantStatusData = createAsyncThunk(
  "variant/updateStatus",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateVariantStatus({ id, data });
      return { ...response, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const variantSlice = createSlice({
  name: "variant",
  initialState,
  reducers: {
    clearVariantError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariantsData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.productId = action.payload.productId;
        state.data = action.payload.data;
      })
      .addCase(fetchVariantsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createVariant.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createVariant.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data.unshift(action.payload.data);
      })
      .addCase(createVariant.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVariantData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateVariantData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const updated = action.payload.data;
        const index = state.data.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        }
      })
      .addCase(updateVariantData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteVariantData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteVariantData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.data = state.data.filter((v) => v._id !== action.payload.id);
      })
      .addCase(deleteVariantData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchPendingVariantsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingVariantsData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.productId = action.payload.productId;
        state.pendingData = action.payload.data;
      })
      .addCase(fetchPendingVariantsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchAllPendingVariantsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPendingVariantsData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.pendingData = action.payload?.data ?? [];
      })
      .addCase(fetchAllPendingVariantsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateVariantStatusData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateVariantStatusData.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        const updated = action.payload.data;
        const index = state.data.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        }
        const pendingIndex = state.pendingData.findIndex(
          (v) => v._id === updated._id,
        );
        if (pendingIndex !== -1) {
          state.pendingData[pendingIndex] = {
            ...state.pendingData[pendingIndex],
            ...updated,
          };
        }
      })
      .addCase(updateVariantStatusData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearVariantError } = variantSlice.actions;
export default variantSlice.reducer;
