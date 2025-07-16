import http from "api/https";

export const getEmployeeByEmail = (email?: string): Promise<any> => {
  return http.get(`/Employee/GetUser`); 
};

export const getDashboardInfo = (): Promise<any> => {
  return http.get(`/Employee/GetDashboardInfo`); 
};

export const getEmployeeDashboardInfo = (): Promise<any> => {
  return http.get(`/Employee/GetEmployeeDashboardInfo`);
};