import http from "api/https";
import { step_partner } from "constants/step_partner";

export const createstep_partner = (data: step_partner): Promise<any> => {
  return http.post(`/step_partner`, data);
};

export const deletestep_partner = (id: number): Promise<any> => {
  return http.remove(`/step_partner/${id}`, {});
};

export const getstep_partner = (id: number): Promise<any> => {
  return http.get(`/step_partner/${id}`);
};

export const getstep_partners = (): Promise<any> => {
  return http.get("/step_partner/GetAll");
};

export const updatestep_partner = (data: step_partner): Promise<any> => {
  return http.put(`/step_partner/${data.id}`, data);
};

export const getstep_partnersBystep_id = (step_id: number): Promise<any> => {
  return http.get(`/step_partner/GetBystep_id?step_id=${step_id}`);
};

export const getstep_partnersBypartner_id = (partner_id: number): Promise<any> => {
  return http.get(`/step_partner/GetBypartner_id?partner_id=${partner_id}`);
};