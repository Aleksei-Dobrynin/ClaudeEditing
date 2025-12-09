import http from "api/https";

export const getAttributeType = (id: number): Promise<any> => {
  return http.get(`/attribute_type/GetOneById?id=${id}`);
};
