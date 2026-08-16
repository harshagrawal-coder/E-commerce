import { config } from "../config/config";
import axios from "axios";
const apiInstance = axios.create({
  baseURL: config.API_URI,
});
apiInstance.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem(config.TOKEN_KEY);
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }
  return axiosConfig;
});
export const fetchSubCategory = async () => {
  const response = await apiInstance.get(`/subcategory`);
  return response.data;
};
export const fetchSubCategoryByCategory = async (categoryId) => {
  const response = await apiInstance.get(`/subcategory?category=${categoryId}`);
  return response.data;
};
export const addSubCategory = async (data) => {
  const response = await apiInstance.post("/subcategory", data);
  return response.data;
};
export const updateSubCategory = async (data, id) => {
  const response = await apiInstance.put(`/subcategory/${id}`, data);
  return response.data;
};
export const deleteSubCategory = async (id) => {
  const response = await apiInstance.delete(`/subcategory/${id}`);
  return response.data;
};
