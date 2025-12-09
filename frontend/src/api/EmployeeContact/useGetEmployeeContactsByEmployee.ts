import http from "api/https";

export const getEmployeeContactsByEmployee = (id_employee:number): Promise<any> => {
  return http.get("/EmployeeContact/GetByidEmployee?idEmployee="+ id_employee);
};