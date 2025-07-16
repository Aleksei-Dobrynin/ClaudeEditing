import http from "api/https";

export const getApplicationDocumentTypes = (): Promise<any> => {
  return http.get("/ApplicationDocumentType/GetAll");
};