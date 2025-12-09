import http from "api/https";

export const getTags = (): Promise<any> => {
  return http.get("/Tag/GetAll");
};