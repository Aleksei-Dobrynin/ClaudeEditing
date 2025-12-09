import http from "api/https";
import { DecisionType } from "../../constants/DecisionType";

export const createDecisionType = (data: DecisionType): Promise<any> => {
  return http.post(`/DecisionType/Create`, data);
};

export const getDecisionTypes = (): Promise<any> => {
  return http.get("/DecisionType/GetAll");
};

export const getDecisionType = (id: number): Promise<any> => {
  return http.get(`/DecisionType/GetOneById?id=${id}`);
};

export const updateDecisionType = (data: DecisionType): Promise<any> => {
  return http.put(`/DecisionType/Update`, data);
};

export const deleteDecisionType = (id: number): Promise<any> => {
  return http.remove(`/DecisionType/Delete?id=${id}`, {});
};



