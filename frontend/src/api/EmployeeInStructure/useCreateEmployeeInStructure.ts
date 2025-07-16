import http from "api/https";
import { EmployeeInStructure } from "../../constants/EmployeeInStructure";

export const createEmployeeInStructure = (data: EmployeeInStructure): Promise<any> => {
  return http.post(`/EmployeeInStructure/Create`, data);
};
