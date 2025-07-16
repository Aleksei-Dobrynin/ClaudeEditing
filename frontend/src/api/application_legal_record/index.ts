import http from "api/https";
import { application_legal_record } from "constants/application_legal_record";

export const createapplication_legal_record = (data: application_legal_record): Promise<any> => {
  return http.post(`/application_legal_record`, data);
};

export const deleteapplication_legal_record = (id: number): Promise<any> => {
  return http.remove(`/application_legal_record/${id}`, {});
};

export const getapplication_legal_record = (id: number): Promise<any> => {
  return http.get(`/application_legal_record/${id}`);
};

export const getapplication_legal_records = (): Promise<any> => {
  return http.get("/application_legal_record/GetAll");
};

export const updateapplication_legal_record = (data: application_legal_record): Promise<any> => {
  return http.put(`/application_legal_record/${data.id}`, data);
};


export const getapplication_legal_recordsByid_application = (id_application: number): Promise<any> => {
  return http.get(`/application_legal_record/GetByid_application?id_application=${id_application}`);
};
