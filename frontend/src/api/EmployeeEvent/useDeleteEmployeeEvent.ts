import http from "api/https";

export const deleteEmployeeEvent = (id: number): Promise<any> => {
  return http.remove(`/EmployeeEvent/Delete?id=${id}`, {});
};
