import http from "api/https";

export const getApplicationFilterTypes = (): Promise<any> => {
  return http.get("/ApplicationFilterType/GetAll");
};