import http from "api/https";
import { EmployeeEvent } from "../../constants/EmployeeEvent";

export const createEmployeeEvent = (data: EmployeeEvent): Promise<any> => {
  return http.post(`/EmployeeEvent/Create`, data);
};
