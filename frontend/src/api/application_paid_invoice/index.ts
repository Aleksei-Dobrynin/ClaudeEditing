import http from "api/https";
import { application_paid_invoice } from "constants/application_paid_invoice";

export const createapplication_paid_invoice = (data: application_paid_invoice): Promise<any> => {
  return http.post(`/ApplicationPaidInvoice`, data);
};

export const deleteapplication_paid_invoice = (id: number): Promise<any> => {
  return http.remove(`/ApplicationPaidInvoice/${id}`, {});
};

export const getapplication_paid_invoice = (id: number): Promise<any> => {
  return http.get(`/ApplicationPaidInvoice/${id}`);
};

export const getapplication_paid_invoices = (): Promise<any> => {
  return http.get("/ApplicationPaidInvoice/GetAll");
};

export const updateapplication_paid_invoice = (data: application_paid_invoice): Promise<any> => {
  return http.put(`/ApplicationPaidInvoice/${data.id}`, data);
};

