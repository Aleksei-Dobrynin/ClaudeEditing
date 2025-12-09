import http from "api/https";
import { CustomerRepresentative } from "../../constants/CustomerRepresentative";

export const createCustomerRepresentative = (data: CustomerRepresentative): Promise<any> => {
  return http.post(`/CustomerRepresentative/Create`, data);
};
