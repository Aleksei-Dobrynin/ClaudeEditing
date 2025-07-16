import http from "api/https";

export const getService = (id: number): Promise<any> => {
  return http.get(`/Service/GetOneById?id=${id}`);
};
