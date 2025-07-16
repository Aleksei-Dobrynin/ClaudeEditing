import http from "api/https";

export const getFiles = (): Promise<any> => {
  return http.get("/File/GetAll");
};