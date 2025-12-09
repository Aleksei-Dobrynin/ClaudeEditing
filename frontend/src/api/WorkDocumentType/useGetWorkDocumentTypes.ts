import http from "api/https";

export const getWorkDocumentTypes = (): Promise<any> => {
  return http.get("/WorkDocumentType/GetAll");
};