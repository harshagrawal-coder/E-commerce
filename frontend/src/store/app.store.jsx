import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import categoryReducer from "../store/slices/categorySlice";
import subCategoryReducer from "../store/slices/subCategorySlice";
import brandReducer from "../store/slices/brand.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    brand: brandReducer,
  },
});
