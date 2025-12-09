import http from "api/https";

export const getFileForApplicationDocument = (id: number): Promise<any> => {
  return http.get(`/FileForApplicationDocument/GetOneById?id=${id}`);
};
