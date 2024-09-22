import axios, { AxiosInstance } from "axios";

export const addAuthFailedInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      return Promise.reject(error);
    }
  );
};

export const createClient = (url: string) => {
  return axios.create({
    baseURL: url,
    timeout: 120000,
    headers: {
      Accept: "application/json",
    },
  });
};
