import http from "api/https";

export const getContragent = (id: number): Promise<any> => {
  return http.get(`/attribute_type/GetOneById?id=${id}`);
};
