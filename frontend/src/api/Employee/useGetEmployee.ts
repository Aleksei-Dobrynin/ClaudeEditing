import http from "api/https";

export const getEmployee = (id: number): Promise<any> => {
  return http.get(`/Employee/GetOneById?id=${id}`);
};

export const getCurrentUser = (): Promise<any> => {
  return http.get(`/UserRole/GetCurentUserId`);
};
