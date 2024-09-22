import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export type ResponseType<T> = {
  data?: T;
  status: number;
  error?: any;
};

export type AxiosErrorData = {
  error?: string;
  message?: string;
  statusCode?: number;
};

export const get = async <T>({
  client,
  url,
  config,
  onResponse,
  onError,
}: {
  client: AxiosInstance;
  url: string;
  config?: any;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return client
      .get<T>(url, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

export const getUrl = async <T>({
  url,
  config,
  token, // Add the token parameter here
  onResponse,
  onError,
}: {
  url: string;
  config?: AxiosRequestConfig;
  token?: string; // Add token as a parameter
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  // Initialize config if not provided
  if (!config) {
    config = {};
  }

  // Add Authorization header if token is provided
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return axios
      .get<T>(url, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};


export const postUrl = async <T>({
  url,
  data,
  config,
  token,
  onResponse,
  onError,
}: {
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  token?: string;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  if (config) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  } else {
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return axios
      .post<T>(url, data, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};


export const post = async <T>({
  client,
  url,
  data,
  config,
  onResponse,
  onError,
}: {
  client: AxiosInstance;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return client
      .post<T>(url, data, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))

      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

export const remove = async <T>({
  client,
  url,
  config,
  onResponse,
  onError,
}: {
  client: AxiosInstance;
  url: string;
  config?: AxiosRequestConfig;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return client
      .delete<T>(url, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))

      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

export const put = async <T>({
  client,
  url,
  data,
  config,
  onResponse,
  onError,
}: {
  client: AxiosInstance;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return client
      .put<T>(url, data, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

export const putUrl = async <T>({
  url,
  data,
  config,
  onResponse,
  onError,
}: {
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return axios
      .put<T>(url, data, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

export const patch = async <T>({
  client,
  url,
  data,
  config,
  onResponse,
  onError,
}: {
  client: AxiosInstance;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  onResponse?: (data: ResponseType<T>) => void;
  onError?: (error: any) => void;
}) => {
  const promise = new Promise<ResponseType<T>>(async (resolve) => {
    return client
      .patch<T>(url, data, config)
      .then((response) => handleResponse<T>(response, resolve, onResponse))
      .catch((reason: AxiosError<AxiosErrorData>) =>
        handleCatchedError(reason, resolve, onError)
      );
  }).catch((error) => handleError<T>(error, onError));

  return promise;
};

const handleResponse = <T>(
  response: AxiosResponse<T, any>,
  resolve: (value: ResponseType<T> | PromiseLike<ResponseType<T>>) => void,
  onResponse?: (data: ResponseType<T>) => void
) => {
  if (onResponse) {
    onResponse({
      data: response.data,
      status: response.status,
    });
  }
  return resolve({
    data: response.data,
    status: response.status,
  });
};

const handleError = <T>(
  error: any,
  onError?: (error: any) => void
): ResponseType<T> => {
  showError(error?.message || error?.error?.message);

  if (onError) {
    onError(error);
  }
  return { error: error, status: -1 };
};

const handleCatchedError = (
  error: AxiosError<AxiosErrorData>,
  resolve: any,
  onError?: (error: any) => void
) => {
  showError(error?.response?.data?.error || error.message);

  if (onError) {
    onError(error);
  } else {
    console.log("NO ERROR HANDLER ");
  }

  return resolve({
    error: error,
    status: error.status || -1,
  });
};

// handle user friendly api error message here
const showError = (message: string) => {
  console.log("api error :: " + message);
};
