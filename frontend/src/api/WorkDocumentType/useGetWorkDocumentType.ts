import http from "api/https";

export const getWorkDocumentType = (id: number): Promise<any> => {
  return http.get(`/WorkDocumentType/GetOneById?id=${id}`);
};
