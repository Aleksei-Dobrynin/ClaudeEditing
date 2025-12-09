import http from "api/https";
import { EmployeeEvent } from "../../constants/EmployeeEvent";

export const updateEmployeeEvent = (data: EmployeeEvent): Promise<any> => {
  return http.put(`/EmployeeEvent/Update`, data);
};
