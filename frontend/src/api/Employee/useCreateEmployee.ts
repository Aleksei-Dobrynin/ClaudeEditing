import http from "api/https";
import { Employee } from "../../constants/Employee";

export const createEmployee = (data: Employee): Promise<any> => {
  return http.post(`/Employee/Create`, data);
};

export const createUser = (data: any): Promise<any> => {
  return http.post(`/Employee/createUser`, data);
};
