import axios from "axios";
import store from "../store/store"; // Điều chỉnh path cho đúng
import { refreshTokenThunk } from "../store/authSlide";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Biến kiểm soát trạng thái refresh -----
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (err: any) => void;
}[] = [];

let lastRefreshAttempt = 0;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 phút

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----- Interceptor xử lý response -----
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh, đưa vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      const now = Date.now();

      // Nếu đã thử refresh gần đây → bỏ qua
      // if (now - lastRefreshAttempt < REFRESH_INTERVAL) {
      //   processQueue(error, null); // Đừng quên reject các request đang đợi
      //   isRefreshing = false;
      //   return Promise.reject(error);
      // }

      lastRefreshAttempt = now;

      try {
        const { accessToken } = await store.dispatch(refreshTokenThunk()).unwrap();
        processQueue(null, accessToken);

        // Gắn token mới rồi retry request ban đầu
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
