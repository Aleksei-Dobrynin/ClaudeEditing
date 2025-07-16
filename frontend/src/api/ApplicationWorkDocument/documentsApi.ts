import http from "api/https";

// Application APIs
export const getApplication = (id: number): Promise<any> => {
  return http.get(`/Application/GetOneById?id=${id}`);
};

export const getApplicationSteps = (applicationId: number): Promise<any> => {
  return http.get(`/application_step/GetByapplication_id?application_id=${applicationId}`);
};

export const getApplicationDocuments = (applicationId: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetByapplication_document_id?application_document_id=${applicationId}`);
};

export const getDocumentApprovals = (applicationId: number): Promise<any> => {
  return http.get(`/DocumentApproval/GetByApplicationId?applicationId=${applicationId}`);
};

// Step operations
export const startStep = (stepId: number): Promise<any> => {
  return http.post(`/application_step/Start`, { stepId });
};

export const completeStep = (stepId: number): Promise<any> => {
  return http.post(`/application_step/Complete`, { stepId });
};

export const pauseStep = (stepId: number, reason: string): Promise<any> => {
  return http.post(`/application_step/Pause`, { stepId, reason });
};

export const resumeStep = (stepId: number): Promise<any> => {
  return http.post(`/application_step/Resume`, { stepId });
};

export const returnStep = (stepId: number, comment: string): Promise<any> => {
  return http.post(`/application_step/Return`, { stepId, comment });
};

export const toProgressStep = (stepId: number): Promise<any> => {
  return http.post(`/application_step/ToProgress`, { stepId });
};

// Document operations
export const uploadDocument = (data: {
  applicationId: number;
  documentTypeId: number;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("applicationId", data.applicationId.toString());
  formData.append("documentTypeId", data.documentTypeId.toString());
  formData.append("file", data.file);

  return http.post(`/ApplicationDocument/Upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const signDocument = (documentId: number): Promise<any> => {
  return http.post(`/ApplicationDocument/Sign`, { documentId });
};

export const viewDocument = (documentId: number): Promise<any> => {
  return http.get(`/ApplicationDocument/Download?id=${documentId}`, {
    responseType: "blob",
  });
};

// Reference data APIs
export const getDepartments = (): Promise<any> => {
  return http.get(`/OrgStructure/GetAll`);
};

export const getUsers = (): Promise<any> => {
  return http.get(`/User/GetAll`);
};

export const getDocumentTypes = (): Promise<any> => {
  return http.get(`/ApplicationDocument/GetAll`);
};

export const getStepRequiredDocuments = (pathId: number): Promise<any> => {
  return http.get(`/Step_Required_Document/GetByPathId?pathId=${pathId}`);
};

export const getDocumentApprovers = (pathId: number): Promise<any> => {
  return http.get(`/Document_Approver/GetByPathId?pathId=${pathId}`);
};
