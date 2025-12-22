import http from "api/https";
import { uploaded_application_document, UploadTemplate } from "constants/uploaded_application_document";

export const createuploaded_application_document = (data: uploaded_application_document, fileName: string, file): Promise<any> => {
  const formData = new FormData();
  
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post(`/uploaded_application_document`, formData);
};

export const createnewuploaded_application_document = (data: uploaded_application_document): Promise<any> => {
  return http.post(`/uploaded_application_document/Create`, data);
};

export const uploadTemplate = (data: UploadTemplate): Promise<any> => {
  return http.post(`/uploaded_application_document/UploadTemplate`, data);
};

export const acceptuploaded_application_document = (data: uploaded_application_document): Promise<any> => {
  return http.post(`/uploaded_application_document/AccepDocument`, data);
};
export const adduploaded_application_document = (data: uploaded_application_document): Promise<any> => {
  return http.post(`/uploaded_application_document/Create`, data);
};

export const copyUploadedDocument = (service_document_id: number, application_id: number, file_id: number, uploadedId: number): Promise<any> => {
  const data = {
    application_id, service_document_id, file_id, upl_id: uploadedId
  }
  return http.post(`/uploaded_application_document/CopyUploadedDocument`, data);
};

export const deleteuploaded_application_document = (id: number): Promise<any> => {
  return http.remove(`/uploaded_application_document/${id}`, {});
};

export const getuploaded_application_document = (id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/${id}`);
};

export const getuploaded_application_documents = (): Promise<any> => {
  return http.get("/uploaded_application_document/GetAll");
};

export const updateuploaded_application_document = (data: uploaded_application_document): Promise<any> => {
  return http.put(`/uploaded_application_document/${data.id}`, data);
};


export const getuploaded_application_documentsBy = (application_document_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetCustomByApplicationId?application_document_id=${application_document_id}`);
};

export const getStepsWithInfo = (application_document_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetStepsWithInfo?app_id=${application_document_id}`);
};


export const getStepDocuments = (application_document_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetStepDocuments?app_id=${application_document_id}`);
};

export const getUploadedDocumentsOutcomeToStep = (app_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetUploadedDocumentsOutcomeToStep?app_id=${app_id}`);
};


export const getuploaded_application_documentsByApplicationId = (application_document_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetByapplication_document_id?application_document_id=${application_document_id}`);
};

export const getuploaded_application_documentsByApplicationIdAndStepId = (application_document_id: number, app_step_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/ByApplicationIdAndStepId?application_document_id=${application_document_id}&app_step_id=${app_step_id}`);
};

export const getApplicationWorkDocumentByStepID = (app_step_id: number): Promise<any> => {
  return http.get(`/ApplicationWorkDocument/GetByStepID?app_step_id=${app_step_id}`);
};

export const getAttachedOldDocuments = (application_document_id: number, application_id): Promise<any> => {
  return http.get(`/ApplicationDocument/GetAttachedOldDocuments?application_document_id=${application_document_id}&application_id=${application_id}`);
};
export const getOldUploads = (application_id: number): Promise<any> => {
  return http.get(`/ApplicationDocument/GetOldUploads?application_id=${application_id}`);
};

export const deleteUploadedApplicationDocument = (app_doc_id: number, delete_reason: string): Promise<any> => {
  return http.remove(`/uploaded_application_document/Delete`, { app_doc_id, delete_reason });
};
