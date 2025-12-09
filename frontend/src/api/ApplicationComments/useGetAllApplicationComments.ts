import http from "api/https";

export const getComments = (): Promise<any> => {
  return http.get(`/application_comment/GetAll`);
};
