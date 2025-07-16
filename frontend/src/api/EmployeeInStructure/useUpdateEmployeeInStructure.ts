import http from "api/https";
import { EmployeeInStructure } from "../../constants/EmployeeInStructure";

export const updateEmployeeInStructure = (data: EmployeeInStructure): Promise<any> => {
  return http.put(`/EmployeeInStructure/Update`, data);
};
