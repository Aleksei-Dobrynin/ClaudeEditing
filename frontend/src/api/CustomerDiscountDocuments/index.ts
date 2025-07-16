import http from "api/https";
import { CustomerDiscountDocuments } from "../../constants/CustomerDiscountDocuments";

export const createCustomerDiscountDocuments = (data: CustomerDiscountDocuments): Promise<any> => {
  return http.post(`/CustomerDiscountDocuments/Create`, data);
};

export const getCustomerDiscountDocumentss = (): Promise<any> => {
  return http.get("/CustomerDiscountDocuments/GetAll");
};

export const getCustomerDiscountDocumentsByIdCustomer = (id: number): Promise<any> => {
  return http.get(`/CustomerDiscountDocuments/GetByIdCustomer?idCustomer=${id}`);
};

export const getCustomerDiscountDocuments = (id: number): Promise<any> => {
  return http.get(`/CustomerDiscountDocuments/GetOneById?id=${id}`);
};

export const updateCustomerDiscountDocuments = (data: CustomerDiscountDocuments): Promise<any> => {
  return http.put(`/CustomerDiscountDocuments/Update`, data);
};

export const deleteCustomerDiscountDocuments = (id: number): Promise<any> => {
  return http.remove(`/CustomerDiscountDocuments/Delete?id=${id}`, {});
};



