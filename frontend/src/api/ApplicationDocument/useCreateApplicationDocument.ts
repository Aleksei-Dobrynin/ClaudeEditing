import http from "api/https";
import { ApplicationDocument } from "constants/ApplicationDocument";

export const createApplicationDocument = (data: ApplicationDocument): Promise<any> => {
  return http.post(`/ApplicationDocument/Create`, data);
};


export const createDocumentApproval = (department_id: number, position_id: number, app_step_id: number, document_type_id: number): Promise<any> => {
  return http.post(`/document_approval`, {
    app_document_id: null,
    file_sign_id: null,
    department_id: department_id,
    position_id: position_id,
    status: "waiting",
    approval_date: null,
    comments: "",
    app_step_id: app_step_id,
    document_type_id: document_type_id,
  });
};

// export const addDocumentToStep = (department_id: number, position_id: number, app_step_id: number, document_type_id: number): Promise<any> => {
//   return http.post(`/document_approval/AddSignerToDocument`, {
//     department_id,
//     position_id,
//     app_step_id,
//     document_type_id,
//   });
// };