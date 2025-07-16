import { API_URL } from "constants/config";

import axios from "axios";
import MainStore from "MainStore";

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const SetupInterceptors = (http) => {
  http.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        //@ts-ignore
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
      config.headers["ngrok-skip-browser-warning"] = true;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("Ошибка");

      if (error?.response) {
        console.log("Ошибка с response");
        console.log(error);

        if (error?.response?.status === 401) {
          console.log("Ошибка 401");

          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";

          return Promise.reject(error); // Возврат промиса с ошибкой
        } else if (error?.response?.status === 403) {
          // const message = JSON.parse(error.response?.data);
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : "У вас нет доступа!");
          return Promise.reject(error);
        } else if (error?.response?.status === 422) {
          let message = error.response?.data?.message;
          try {
            const json = JSON.parse(message);
            message = json?.ru
          } catch (e) {
          }
          MainStore.openErrorDialog(
            message && message !== "" ? message : "Ошибка логики, обратитесь к администратору!"
          );
          return Promise.reject(error);
        } else if (error?.response?.status === 404) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : "Страница не найдена!");
          return Promise.reject(error);
        } else if (error?.response?.status === 400) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(
            message && message !== ""
              ? message
              : "Не правильно отправяете данные, обратитесь к администратору!"
          );
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Ошибка с request");
        console.log(error);
        console.log(error.request);
        return Promise.reject(error); // Обработка ошибок с request
      } else {
        console.log("Произошла ошибка настройки запроса:", error.message);
        return Promise.reject(error); // Возврат промиса с ошибкой
      }
    }
  );
};

SetupInterceptors(http);

const get = (url: string, headers = {}, params = {}) => {
  return http
    .get(url, {
      ...params,
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("Ошибка GET");
      console.log(error.toJSON());
    });
};

const post = (url: string, data: any, headers = {}, params = {}) => {
  return http
    .post(url, data, {
      ...params,
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("Ошибка POST");
      console.log(error.toJSON());
      return error;
    });
};

const put = (url: string, data: any, headers = {}) => {
  return http
    .put(url, data, {
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("Ошибка PUT");
      console.log(error.toJSON());
      return error;
    });
};

const remove = (url: string, data: any, headers = {}) => {
  return http
    .delete(url, {
      headers: {
        ...headers,
      },
      data,
    })
    .catch(function (error) {
      console.log("Ошибка REMOVE");
      console.log(error.toJSON());
    });
};
const patch = (url: string, data: any, headers = {}) => {
  return http
    .patch(url, data, {
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("Ошибка PATCH");
      console.log(error.toJSON());
    });
};

const module = {
  http,
  get,
  post,
  put,
  remove,
  patch,
};

export default module;
