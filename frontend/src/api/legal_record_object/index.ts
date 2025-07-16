import http from "api/https";
import { legal_record_object } from "constants/legal_record_object";

export const createlegal_record_object = (data: legal_record_object): Promise<any> => {
  return http.post(`/legal_record_object`, data);
};

export const deletelegal_record_object = (id: number): Promise<any> => {
  return http.remove(`/legal_record_object/${id}`, {});
};

export const getlegal_record_object = (id: number): Promise<any> => {
  return http.get(`/legal_record_object/${id}`);
};

export const getlegal_record_objects = (): Promise<any> => {
  return http.get("/legal_record_object/GetAll");
};

export const updatelegal_record_object = (data: legal_record_object): Promise<any> => {
  return http.put(`/legal_record_object/${data.id}`, data);
};


export const getlegal_record_objectsByid_record = (id_record: number): Promise<any> => {
  return http.get(`/legal_record_object/GetByid_record?id_record=${id_record}`);
};
