import http from "api/https";
import { InvoiceStatus } from "../../constants/InvoiceStatus";

export const createInvoiceStatus = (data: InvoiceStatus): Promise<any> => {
  return http.post(`/InvoiceStatus/Create`, data);
};

export const getInvoiceStatuss = (): Promise<any> => {
  return http.get("/InvoiceStatus/GetAll");
};

export const getInvoiceStatus = (id: number): Promise<any> => {
  return http.get(`/InvoiceStatus/GetOneById?id=${id}`);
};

export const updateInvoiceStatus = (data: InvoiceStatus): Promise<any> => {
  return http.put(`/InvoiceStatus/Update`, data);
};

export const deleteInvoiceStatus = (id: number): Promise<any> => {
  return http.remove(`/InvoiceStatus/Delete?id=${id}`, {});
};



