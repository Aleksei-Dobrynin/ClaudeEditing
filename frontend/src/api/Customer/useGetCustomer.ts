import http from "api/https";

export const getCustomer = (id: number): Promise<any> => {
  return http.get(`/Customer/GetOneById?id=${id}`);
};

export const getCompanyByPin = (pin: string): Promise<any> => {
  return http.get(`/Customer/findCompanyByPin?pin=${pin}`);
};
