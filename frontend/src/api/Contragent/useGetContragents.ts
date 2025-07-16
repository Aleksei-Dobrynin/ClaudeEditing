import http from "api/https";

export const getContragents = (): Promise<any> => {
  return http.get("/contragent/GetAll");
};
