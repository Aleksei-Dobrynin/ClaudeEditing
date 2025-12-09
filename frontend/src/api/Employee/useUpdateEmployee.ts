import http from "api/https";
import { Employee } from "../../constants/Employee";

export const updateEmployee = (data: any): Promise<any> => {
  return http.put(`/Employee/Update`, data);
};
