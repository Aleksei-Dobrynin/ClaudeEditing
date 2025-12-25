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

export const getEmployeesExecutors = (application_id: number): Promise<any> => {
  return http.get(`/application_task_assignee/GetByapplication_id?application_id=${application_id}`);
};