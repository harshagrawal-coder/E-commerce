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
  const response = await apiInstance.get(`/variant/admin/product/${productId}`);
  return response.data;
};

export const addVariant = async ({ data, productId }) => {
  const response = await apiInstance.post(
    `/variant/admin/product/${productId}`,
    data,
  );
  return response.data;
};

export const updateVariant = async ({ data, productId, id }) => {
  const response = await apiInstance.put(
    `/variant/admin/product/${productId}/${id}`,
    data,
  );
  return response.data;
};

export const deleteVariant = async ({ productId, id }) => {
  const response = await apiInstance.delete(
    `/variant/admin/product/${productId}/${id}`,
  );
  return response.data;
};

export const fetchPendingVariants = async (productId) => {
  const response = await apiInstance.get(
    `/variant/admin/product/${productId}/pending`,
  );
  return response.data;
};

export const fetchAllPendingVariants = async () => {
  const response = await apiInstance.get("/variant/admin/pending");
  return response.data;
};

export const updateVariantStatus = async ({ id, data }) => {
  const response = await apiInstance.patch(`/variant/admin/${id}/status`, data);
  return response.data;
};

export const fetchVariantsByVendor = async (productId) => {
  const response = await apiInstance.get(
    `/variant/vendor/product/${productId}`,
  );
  return response.data;
};

export const addVariantByVendor = async ({ data, productId }) => {
  const response = await apiInstance.post(
    `/variant/vendor/product/${productId}`,
    data,
  );
  return response.data;
};

export const updateVariantByVendor = async ({ data, productId, id }) => {
  const response = await apiInstance.put(
    `/variant/vendor/product/${productId}/${id}`,
    data,
  );
  return response.data;
};
export const deleteVariantByVendor = async ({ productId, id }) => {
  const response = await apiInstance.delete(
    `/variant/vendor/product/${productId}/${id}`,
  );
  return response.data;
};
