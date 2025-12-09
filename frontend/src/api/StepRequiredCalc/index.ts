import http from "api/https";
import { StepRequiredCalc } from "../../constants/StepRequiredCalc";

export const createStepRequiredCalc = (data: StepRequiredCalc): Promise<any> => {
  return http.post(`/StepRequiredCalc/Create`, data);
};

export const getStepRequiredCalcs = (): Promise<any> => {
  return http.get("/StepRequiredCalc/GetAll");
};

export const getStepRequiredCalc = (id: number): Promise<any> => {
  return http.get(`/StepRequiredCalc/GetOneById?id=${id}`);
};

export const updateStepRequiredCalc = (data: StepRequiredCalc): Promise<any> => {
  return http.put(`/StepRequiredCalc/Update`, data);
};

export const deleteStepRequiredCalc = (id: number): Promise<any> => {
  return http.remove(`/StepRequiredCalc/Delete?id=${id}`, {});
};



