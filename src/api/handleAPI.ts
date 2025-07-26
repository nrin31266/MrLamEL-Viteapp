import type { Method } from "axios";
import axiosInstance from "./axiosInstance";
import axios from "axios";

interface RequestParams<B = unknown> {
  endpoint: string;
  body?: B;
  method?: Method;
  isAuth?: boolean;
  params?: Record<string, any>;
  withCredentials?: boolean;
}

interface IApiResponse<T> {
  data: T;
  message: string;
  code: number;
}

const handleAPI = async <T, B = unknown>({
  endpoint,
  body,
  method = "get",
  isAuth = false,
  params,
  withCredentials = false
}: RequestParams<B>): Promise<T> => {
  try {
    const headers: Record<string, string> = {};

    if (isAuth) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const axiosResponse = await axiosInstance({
      url: endpoint,
      method,
      data: body,
      headers,
      params,
      withCredentials
    });

    const apiResponse: IApiResponse<T> = axiosResponse.data;
    return apiResponse.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export default handleAPI;
