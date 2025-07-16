import http from "api/https";

export const getFileTypeForApplicationDocuments = (): Promise<any> => {
  return http.get("/FileTypeForApplicationDocument/GetAll");
};