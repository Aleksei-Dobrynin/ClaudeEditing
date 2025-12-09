import http from "api/https";

export const deleteEmployeeInStructure = (id: number): Promise<any> => {
  return http.remove(`/EmployeeInStructure/Delete?id=${id}`, {});
};

export const fireEmployeeInStructure = (id: number): Promise<any> => {
  return http.post(`/EmployeeInStructure/FireEmployee?id=${id}`, {});
};
