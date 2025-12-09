import http from "api/https";

export const getApplicationWorkDocument = (id: number): Promise<any> => {
  return http.get(`/ApplicationWorkDocument/GetOneById?id=${id}`);
};
