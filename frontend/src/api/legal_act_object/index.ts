import http from "api/https";
import { legal_act_object } from "constants/legal_act_object";

export const createlegal_act_object = (data: legal_act_object): Promise<any> => {
  return http.post(`/legal_act_object`, data);
};

export const deletelegal_act_object = (id: number): Promise<any> => {
  return http.remove(`/legal_act_object/${id}`, {});
};

export const getlegal_act_object = (id: number): Promise<any> => {
  return http.get(`/legal_act_object/${id}`);
};

export const getlegal_act_objects = (): Promise<any> => {
  return http.get("/legal_act_object/GetAll");
};

export const updatelegal_act_object = (data: legal_act_object): Promise<any> => {
  return http.put(`/legal_act_object/${data.id}`, data);
};


export const getlegal_act_objectsByid_act = (id_act: number): Promise<any> => {
  return http.get(`/legal_act_object/GetByid_act?id_act=${id_act}`);
};
