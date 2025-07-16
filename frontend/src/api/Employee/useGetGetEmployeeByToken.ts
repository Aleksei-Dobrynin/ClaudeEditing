import http from "../https";

export const getEmployeeByToken = (): Promise<any> => {
  return http.post(`/Employee/GetEmployeeByToken`, null);
};