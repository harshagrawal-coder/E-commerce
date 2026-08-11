import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} from "../../services/attributes.api";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchAttributeData = createAsyncThunk(
  "attribute/fetchattribute",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAttributes();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createAttribute = createAsyncThunk(
  "attribute/createattribute",
  async (data, thunkAPI) => {
    try {
      const response = await addAttribute(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateAttributedata = createAsyncThunk(
  "attribute/updateattribute",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateAttribute(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteAttributedata = createAsyncThunk(
  "attribute/deleteattribute",
  async (id, thunkAPI) => {
    try {
      const response = await deleteAttribute(id);

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
const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchAttributeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createAttribute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttribute.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload.data);
      })
      .addCase(createAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateAttributedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttributedata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedAttribute = action.payload.data;
        const index = state.data.findIndex(
          (attribute) => attribute._id === updatedAttribute._id,
        );
        if (index !== -1) {
          state.data[index] = updatedAttribute;
        }
      })
      .addCase(updateAttributedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteAttributedata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttributedata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = state.data.filter(
          (attribute) => attribute._id !== action.payload.id,
        );
      })
      .addCase(deleteAttributedata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});
export const { clearError } = attributeSlice.actions;
export default attributeSlice.reducer;
