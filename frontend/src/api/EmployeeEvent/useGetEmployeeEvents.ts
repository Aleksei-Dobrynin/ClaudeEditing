import http from "api/https";

export const getEmployeeEvents = (): Promise<any> => {
  return http.get("/EmployeeEvent/GetAll");
};

export const getEmployeeEventsByIDEmployee = (idEmployee: number): Promise<any> => {
  return http.get(`/EmployeeEvent/GetByIDEmployee?idEmployee=${idEmployee}`);
};