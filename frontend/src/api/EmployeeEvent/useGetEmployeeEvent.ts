import http from "api/https";

export const getEmployeeEvent = (id: number): Promise<any> => {
  return http.get(`/EmployeeEvent/GetOneById?id=${id}`);
};
