import http from "api/https";
import { step_dependency } from "constants/step_dependency";

export const createstep_dependency = (data: step_dependency): Promise<any> => {
  return http.post(`/step_dependency`, data);
};

export const deletestep_dependency = (id: number): Promise<any> => {
  return http.remove(`/step_dependency/${id}`, {});
};

export const getstep_dependency = (id: number): Promise<any> => {
  return http.get(`/step_dependency/${id}`);
};

export const getstep_dependencies = (): Promise<any> => {
  return http.get("/step_dependency/GetAll");
};

export const updatestep_dependency = (data: step_dependency): Promise<any> => {
  return http.put(`/step_dependency/${data.id}`, data);
};

export const getstep_dependenciesByFilter = (data: any  ): Promise<any> => {
  return http.post(`/step_dependency/GetByFilter`, data);
};


