import http from "api/https";

export const getOneByPin = (pin: string, customer_id: number): Promise<any> => {
  return http.get(`/Customer/GetOneByPin?pin=${pin}&customer_id=${customer_id}`);
};