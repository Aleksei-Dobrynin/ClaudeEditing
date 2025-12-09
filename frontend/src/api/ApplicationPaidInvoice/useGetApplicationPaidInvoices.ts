import http from "api/https";

export const getApplicationPaidInvoices = (): Promise<any> => {
  return http.get("/ApplicationPaidInvoice/GetAll");
};

export const getApplicationPaidInvoiceByIDApplication = (idApplication: number): Promise<any> => {
  return http.get(`/ApplicationPaidInvoice/GetOneByIDApplication?idApplication=${idApplication}`);
};

export const getApplicationWithTaxAndDateRange = (startDate: string, endDate: string): Promise<any> => {
  return http.get(`/ApplicationPaidInvoice/GetApplicationWithTaxAndDateRange?&startDate=${startDate}&endDate=${endDate}`);
};
