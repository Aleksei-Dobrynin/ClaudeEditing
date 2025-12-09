import http from "api/https";
import { Customer } from "../../constants/Customer";

export const createCustomer = (data: Customer): Promise<any> => {
  return http.post(`/Customer/Create`, data);
};
