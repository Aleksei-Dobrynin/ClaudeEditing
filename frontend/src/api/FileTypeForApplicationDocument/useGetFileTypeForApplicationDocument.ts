import http from "api/https";

export const getFileTypeForApplicationDocument = (id: number): Promise<any> => {
  return http.get(`/FileTypeForApplicationDocument/GetOneById?id=${id}`);
};
