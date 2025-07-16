import http from "api/https";
import { ApplicationRequiredCalc } from "../../constants/ApplicationRequiredCalc";

export const createApplicationRequiredCalc = (data: ApplicationRequiredCalc): Promise<any> => {
  return http.post(`/ApplicationRequiredCalc/Create`, data);
};

export const getApplicationRequiredCalcs = (): Promise<any> => {
  return http.get("/ApplicationRequiredCalc/GetAll");
};

export const getApplicationRequiredCalc = (id: number): Promise<any> => {
  return http.get(`/ApplicationRequiredCalc/GetOneById?id=${id}`);
};

export const updateApplicationRequiredCalc = (data: ApplicationRequiredCalc): Promise<any> => {
  return http.put(`/ApplicationRequiredCalc/Update`, data);
};

export const deleteApplicationRequiredCalc = (id: number): Promise<any> => {
  return http.remove(`/ApplicationRequiredCalc/Delete?id=${id}`, {});
};



