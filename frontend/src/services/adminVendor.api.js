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

export const fetchAllVendors = async () => {
  const response = await apiInstance.get("/admin/vendors");
  return response.data;
};
export const fetchVendorDetail = async (id) => {
  const response = await apiInstance.get(`/admin/vendors/${id}`);
  return response.data;
};
export const updateVendorStatus = async (data, id) => {
  const response = await apiInstance.patch(`/admin/vendors/${id}/status`, data);
  return response.data;
};