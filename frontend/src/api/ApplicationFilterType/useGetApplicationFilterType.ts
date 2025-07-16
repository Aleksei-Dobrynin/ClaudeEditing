import http from "api/https";

export const getApplicationFilterType = (id: number): Promise<any> => {
  return http.get(`/ApplicationFilterType/GetOneById?id=${id}`);
};
