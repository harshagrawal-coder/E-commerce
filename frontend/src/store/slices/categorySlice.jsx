import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.api";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      const response = await getCategory();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data, thunkAPI) => {
    try {
      const response = await addCategory(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateCategorydata = createAsyncThunk(
  "category/updateCategory",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateCategory(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const deleteCategorydata = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    try {
      const response = await deleteCategory(id);

      // We need the ID because backend doesn't return it
      return {
        ...response,
        id,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateCategorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedCategory = action.payload.category;
        const index = state.data.findIndex(
          (category) => category._id === updatedCategory._id,
        );

        if (index !== -1) {
          state.data[index] = updatedCategory;
        }
      })

      .addCase(updateCategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteCategorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCategorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data = state.data.filter(
          (category) => category._id !== action.payload.id,
        );
      })

      .addCase(deleteCategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError } = categorySlice.actions;

export default categorySlice.reducer;
