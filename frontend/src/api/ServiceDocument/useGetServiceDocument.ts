import http from "api/https";

export const getServiceDocument = (id: number): Promise<any> => {
  return http.get(`/ServiceDocument/GetOneById?id=${id}`);
};
