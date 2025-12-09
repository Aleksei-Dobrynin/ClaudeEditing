import http from "api/https";
import { contact_type } from "constants/contact_type";

export const createcontact_type = (data: contact_type): Promise<any> => {
  return http.post(`/contact_type`, data);
};

export const deletecontact_type = (id: number): Promise<any> => {
  return http.remove(`/contact_type/${id}`, {});
};

export const getcontact_type = (id: number): Promise<any> => {
  return http.get(`/contact_type/${id}`);
};

export const getcontact_types = (): Promise<any> => {
  return http.get("/contact_type/GetAll");
};

export const updatecontact_type = (data: contact_type): Promise<any> => {
  return http.put(`/contact_type/${data.id}`, data);
};


