import http from "api/https";

export const getCustomer = (id: number): Promise<any> => {
  return http.get(`/Customer/GetOneById?id=${id}`);
};
