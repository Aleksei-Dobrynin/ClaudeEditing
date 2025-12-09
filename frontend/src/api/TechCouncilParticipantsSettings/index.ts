import http from "api/https";
import { TechCouncilParticipantsSettings } from "../../constants/TechCouncilParticipantsSettings";

export const createTechCouncilParticipantsSettings = (data: TechCouncilParticipantsSettings): Promise<any> => {
  return http.post(`/TechCouncilParticipantsSettings/Create`, data);
};

export const getTechCouncilParticipantsSettingss = (): Promise<any> => {
  return http.get("/TechCouncilParticipantsSettings/GetAll");
};

export const getTechCouncilParticipantsSettings = (id: number): Promise<any> => {
  return http.get(`/TechCouncilParticipantsSettings/GetOneById?id=${id}`);
};

export const getTechCouncilParticipantsSettingsByServiceId = (id: number): Promise<any> => {
  return http.get(`/TechCouncilParticipantsSettings/GetByServiceId?service_id=${id}`);
};

export const getActiveTechCouncilParticipantsSettingsByServiceId = (id: number): Promise<any> => {
  return http.get(`/TechCouncilParticipantsSettings/GetActiveParticipantsByServiceId?service_id=${id}`);
};

export const updateTechCouncilParticipantsSettings = (data: TechCouncilParticipantsSettings): Promise<any> => {
  return http.put(`/TechCouncilParticipantsSettings/Update`, data);
};

export const deleteTechCouncilParticipantsSettings = (id: number): Promise<any> => {
  return http.remove(`/TechCouncilParticipantsSettings/Delete?id=${id}`, {});
};



