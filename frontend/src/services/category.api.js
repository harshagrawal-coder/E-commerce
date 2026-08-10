import axios from "axios";
import { config } from "../config/config";
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

export const getCategory = async () => {
  const response = await apiInstance.get("/category");
  return response.data;
};
export const addCategory = async (data) => {
  const response = await apiInstance.post("/category", data);
  return response.data;
};
export const updateCategory = async (data, id) => {
  const response = await apiInstance.put(`/category/${id}`, data);
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await apiInstance.delete(`/category/${id}`);
  return response.data;
};
