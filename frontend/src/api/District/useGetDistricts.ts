import http from "api/https";

export const getDistricts = (): Promise<any> => {
  return http.get("/District/GetAll");
};