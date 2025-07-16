import http from "api/https";

export const getContactTypes = (): Promise<any> => {
  return http.get("/ContactType/GetAll");
};