import http from "api/https";
import { TechDecision } from "constants/tech_decision";

export const createtech_decision = (data: TechDecision): Promise<any> => {
  return http.post(`/tech_decision`, data);
};

export const deletetech_decision = (id: number): Promise<any> => {
  return http.remove(`/tech_decision/${id}`, {});
};

export const gettech_decision = (id: number): Promise<any> => {
  return http.get(`/tech_decision/${id}`);
};

export const gettech_decisions = (): Promise<any> => {
  return http.get("/tech_decision/GetAll");
};

export const updatetech_decision = (data: TechDecision): Promise<any> => {
  return http.put(`/tech_decision/${data.id}`, data);
};


