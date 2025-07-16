import http from "api/https";
import { saved_application_document } from "constants/saved_application_document";

export const createsaved_application_document = (
  data: saved_application_document
): Promise<any> => {
  return http.post(`/saved_application_document`, data);
};

export const deletesaved_application_document = (id: number): Promise<any> => {
  return http.remove(`/saved_application_document/${id}`, {});
};

export const getsaved_application_document = (id: number): Promise<any> => {
  return http.get(`/saved_application_document/${id}`);
};

export const getsaved_application_documents = (): Promise<any> => {
  return http.get("/saved_application_document/GetAll");
};
export const getsaved_application_documentsByApplication = (application_id: number): Promise<any> => {
  return http.get(`/saved_application_document/GetByapplication_id?application_id=${application_id}`);
};

export const updatesaved_application_document = (
  data: saved_application_document
): Promise<any> => {
  return http.put(`/saved_application_document/${data.id}`, data);
};

export const getSavedDocumentByApplication = (
  application_id: number,
  template_id: number,
  language_id: number,
  language_code: string
): Promise<any> => {
  return http.get(
    `/saved_application_document/GetByApplication?application_id=${application_id}&template_id=${template_id}&language_id=${language_id}&language_code=${language_code}`
  );
};

export const createDoc = (
  application_id: number,
  template_id: number,
  language_id: number,
  body: string
): Promise<any> => {
  return http.post(`/saved_application_document/CreateDoc`, {
    application_id,
    template_id,
    language_id,
    body
  });
};
