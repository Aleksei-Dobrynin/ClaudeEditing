import http from "api/https";

export const getCustomerRepresentative = (id: number): Promise<any> => {
  return http.get(`/CustomerRepresentative/GetOneById?id=${id}`);
};
