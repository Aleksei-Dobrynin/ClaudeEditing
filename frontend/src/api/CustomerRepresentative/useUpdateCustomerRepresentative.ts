import http from "api/https";
import { CustomerRepresentative } from "../../constants/CustomerRepresentative";

export const updateCustomerRepresentative = (data: CustomerRepresentative): Promise<any> => {
  return http.put(`/CustomerRepresentative/Update`, data);
};
