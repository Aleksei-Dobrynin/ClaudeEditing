import http from "api/https";

export const getEmployee = (id: number): Promise<any> => {
  return http.get(`/Employee/GetOneById?id=${id}`);
};
