import http from "api/https";
import { ApplicationInvoice } from "../../constants/ApplicationInvoice";

export const createApplicationInvoice = (data: ApplicationInvoice): Promise<any> => {
  return http.post(`/ApplicationInvoice/Create`, data);
};

export const getApplicationInvoices = (): Promise<any> => {
  return http.get("/ApplicationInvoice/GetAll");
};

export const getApplicationInvoice = (id: number): Promise<any> => {
  return http.get(`/ApplicationInvoice/GetOneById?id=${id}`);
};

export const updateApplicationInvoice = (data: ApplicationInvoice): Promise<any> => {
  return http.put(`/ApplicationInvoice/Update`, data);
};

export const deleteApplicationInvoice = (id: number): Promise<any> => {
  return http.remove(`/ApplicationInvoice/Delete?id=${id}`, {});
};

export const getCheckInvoicePayment = (application_id: number): Promise<any> => {
  return http.get(`/ApplicationInvoice/CheckInvoicePayment?application_id=${application_id}`, {});
};

