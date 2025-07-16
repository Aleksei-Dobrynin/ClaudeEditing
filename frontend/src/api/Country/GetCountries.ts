import http from "api/https";

export const getCountries = (): Promise<any> => {
  return http.get("/Country/GetAll");
};