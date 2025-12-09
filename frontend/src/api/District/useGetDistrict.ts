import http from "api/https";

export const getDistrict = (id: number): Promise<any> => {
  return http.get(`/District/GetOneById?id=${id}`);
};
