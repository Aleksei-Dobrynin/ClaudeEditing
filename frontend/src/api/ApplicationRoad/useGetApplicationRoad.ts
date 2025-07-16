import http from "api/https";

export const getApplicationRoad = (id: number): Promise<any> => {
  return http.get(`/ApplicationRoad/GetOneById?id=${id}`);
};
