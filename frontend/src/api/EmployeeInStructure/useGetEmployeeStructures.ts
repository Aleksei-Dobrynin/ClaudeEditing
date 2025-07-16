import http from "api/https";

export const getEmployeeStructures = (idEmployee: number): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetByidEmployee?idEmployee=${idEmployee}`);
};

export const GetMyCurrentStructure = (): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetMyCurrentStructure`);
};

