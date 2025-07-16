import http from "api/https";
import { CustomerDiscount } from "../../constants/CustomerDiscount";

export const createCustomerDiscount = (data: CustomerDiscount): Promise<any> => {
  return http.post(`/CustomerDiscount/Create`, data);
};

export const getCustomerDiscounts = (): Promise<any> => {
  return http.get("/CustomerDiscount/GetAll");
};

export const getCustomerDiscount = (id: number): Promise<any> => {
  return http.get(`/CustomerDiscount/GetOneById?id=${id}`);
};

export const getCustomerDiscountByIdApplication = (idApplication: number): Promise<any> => {
  return http.get(`/CustomerDiscount/GetOneByIdApplication?idApplication=${idApplication}`);
};

export const updateCustomerDiscount = (data: CustomerDiscount): Promise<any> => {
  return http.put(`/CustomerDiscount/Update`, data);
};

export const deleteCustomerDiscount = (id: number): Promise<any> => {
  return http.remove(`/CustomerDiscount/Delete?id=${id}`, {});
};



