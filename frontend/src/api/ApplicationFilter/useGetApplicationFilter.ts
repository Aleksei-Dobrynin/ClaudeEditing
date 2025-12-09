import http from "api/https";

export const getApplicationFilter = (id: number): Promise<any> => {
  return http.get(`/ApplicationFilter/GetOneById?id=${id}`);
};
