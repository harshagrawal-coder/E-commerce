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

export const fetchVariantsByProduct = async (productId) => {
  const response = await apiInstance.get(`/variant/product/${productId}`);
  return response.data;
};

export const addVariant = async ({ data, productId }) => {
  const response = await apiInstance.post(`/variant/product/${productId}`, data);
  return response.data;
};

export const updateVariant = async ({ data, productId, id }) => {
  const response = await apiInstance.put(
    `/variant/product/${productId}/${id}`,
    data,
  );
  return response.data;
};

export const deleteVariant = async ({ productId, id }) => {
  const response = await apiInstance.delete(
    `/variant/product/${productId}/${id}`,
  );
  return response.data;
};
