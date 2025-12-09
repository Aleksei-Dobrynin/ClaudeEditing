import http from "api/https";
import { document_approver } from "constants/document_approver";

export const createdocument_approver = (data: document_approver): Promise<any> => {
  return http.post(`/document_approver`, data);
};

export const deletedocument_approver = (id: number): Promise<any> => {
  return http.remove(`/document_approver/${id}`, {});
};

export const getdocument_approver = (id: number): Promise<any> => {
  return http.get(`/document_approver/${id}`);
};

export const getdocument_approvers = (): Promise<any> => {
  return http.get("/document_approver/GetAll");
};

export const updatedocument_approver = (data: document_approver): Promise<any> => {
  return http.put(`/document_approver/${data.id}`, data);
};


export const getdocument_approversBystep_doc_id = (step_doc_id: number): Promise<any> => {
  return http.get(`/document_approver/GetBystep_doc_id?step_doc_id=${step_doc_id}`);
};
