import http from "api/https";
import { step_required_document } from "constants/step_required_document";

export const createstep_required_document = (data: step_required_document): Promise<any> => {
  return http.post(`/step_required_document`, data);
};

export const deletestep_required_document = (id: number): Promise<any> => {
  return http.remove(`/step_required_document/${id}`, {});
};

export const getstep_required_document = (id: number): Promise<any> => {
  return http.get(`/step_required_document/${id}`);
};

export const getstep_required_documents = (): Promise<any> => {
  return http.get("/step_required_document/GetAll");
};

export const updatestep_required_document = (data: step_required_document): Promise<any> => {
  return http.put(`/step_required_document/${data.id}`, data);
};


export const getstep_required_documentsBystep_id = (step_id: number): Promise<any> => {
  return http.get(`/step_required_document/GetBystep_id?step_id=${step_id}`);
};
