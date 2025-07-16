import http from "api/https";

export const deleteEmployee = (id: number): Promise<any> => {
  return http.remove(`/Employee/Delete?id=${id}`, {});
};
