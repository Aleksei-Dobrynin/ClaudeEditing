import http from "api/https";
import { Customer } from "../../constants/Customer";

export const updateCustomer = (data: Customer): Promise<any> => {
  return http.put(`/Customer/Update`, data);
};
