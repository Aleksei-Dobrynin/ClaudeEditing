import http from "api/https";

export const getApplicationPaidInvoice = (id: number): Promise<any> => {
  return http.get(`/ApplicationPaidInvoice/GetOneById?id=${id}`);
};