import http from "api/https";

export const getApplicationDocumentType = (id: number): Promise<any> => {
  return http.get(`/ApplicationDocumentType/GetOneById?id=${id}`);
};
