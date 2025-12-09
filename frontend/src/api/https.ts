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

        const { status, data } = error.response;

        // НОВЫЙ ОБРАБОТЧИК: ServiceUnavailable (503) - недоступность внешних сервисов
        if (status === 503) {
          let message = "";
          
          if (data?.isTimeout) {
            const serviceName = data?.serviceName || "Внешний сервис";
            message = `${serviceName} не отвечает. Превышено время ожидания (10 секунд). Пожалуйста, попробуйте позже.`;
          } else {
            message = data?.message || "Внешний сервис временно недоступен. Пожалуйста, попробуйте позже.";
          }
          
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }
        
        // НОВЫЙ ОБРАБОТЧИК: Timeout (408)
        if (status === 408) {
          const message = data?.message || "Превышено время ожидания ответа от сервиса. Пожалуйста, попробуйте позже.";
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }
        
        // НОВЫЙ ОБРАБОТЧИК: Bad Gateway (502)
        if (status === 502) {
          const message = data?.message || "Не удалось подключиться к внешнему сервису. Проверьте подключение к интернету или попробуйте позже.";
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }

        // Все остальное остается как было
        if (error?.response?.status === 401) {
          console.log("Ошибка 401");

          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";

          return Promise.reject(error);
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
              : "Не правильно отправлете данные, обратитесь к администратору!"
          );
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Ошибка с request");
        console.log(error);
        console.log(error.request);
        return Promise.reject(error);
      } else {
        console.log("Произошла ошибка настройки запроса:", error.message);
        return Promise.reject(error);
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