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
export const fetchAttributes = async () => {
  const response = await apiInstance.get(`/attribute`);
  return response.data;
};
export const addAttribute = async (data) => {
  const response = await apiInstance.post("/attribute", data);
  return response.data;
};
export const updateAttribute = async (data, id) => {
  const response = await apiInstance.put(`/attribute/${id}`, data);
  return response.data;
};
export const deleteAttribute = async (id) => {
  const response = await apiInstance.delete(`/attribute/${id}`);
  return response.data;
};
