import http from "api/https";

export const getEmployeeByUserId = (id: number): Promise<any> => {
  return http.get(`/Employee/GetOneByUserId?email=${localStorage.getItem("currentUser")}`);
};

export const getEmployeeByIdUser = (id: string): Promise<any> => {
  return http.get(`/Employee/GetByUserId?userId=${id}`);
};

