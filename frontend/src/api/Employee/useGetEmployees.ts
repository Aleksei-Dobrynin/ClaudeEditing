import http from "api/https";

export const getEmployees = (): Promise<any> => {
  return http.get("/Employee/GetAll");
};
export const getByApplicationId = (application_id: number): Promise<any> => {
  return http.get(`/Employee/GetByApplicationId?application_id=${application_id}`);
};


export const getRegisterEmployees = (): Promise<any> => {
  return http.get("/Employee/GetAllRegister");
};
