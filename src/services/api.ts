import useAuthStore from "@/store/auth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API || "http://localhost:4104/api/v1";

const apiAuth = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const shouldSkipAuthHeader = (url?: string) => {
  if (!url) return false;
  return ["/auth/login", "/auth/2fa/verify", "/auth/refresh-token"].some(
    (path) => url.includes(path),
  );
};

const shouldSkipRefreshRetry = (url?: string) => {
  if (!url) return false;
  return ["/auth/refresh-token", "/auth/login", "/auth/2fa/verify"].some(
    (path) => url.includes(path),
  );
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiAuth.interceptors.request.use((config) => {
  const token = useAuthStore().getToken();
  if (
    token &&
    !config.headers.Authorization &&
    !shouldSkipAuthHeader(config.url)
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const skipRefreshRetry = shouldSkipRefreshRetry(originalRequest?.url);

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !skipRefreshRetry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiAuth(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await useAuthStore().getRefreshToken();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return apiAuth(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore().clearAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export { apiAuth, apiPublic };
