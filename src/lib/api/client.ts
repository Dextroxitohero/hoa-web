import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (TENANT_ID) {
    config.headers["x-tenant-id"] = TENANT_ID;
  }
  return config;
});
