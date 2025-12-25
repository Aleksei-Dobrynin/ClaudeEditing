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

export const applyDocumentApproval = (
  stepId: number,
  documentTypeId: number,
  draft: any[]
): Promise<any> => {
  return http.post(`/document_approval/apply`,
    draft.map(x => ({
      id: x.id,
      app_document_id: null,
      file_sign_id: null,
      department_id: x.department_id,
      position_id: x.position_id,
      status: x.status,
      approval_date: null,
      comments: x.comments ?? "",
      app_step_id: stepId,
      document_type_id: documentTypeId,
      order_number: x.order_number,
      is_required: x.is_required,
      is_final: x.is_final,
    }))
  );
};

// export const addDocumentToStep = (department_id: number, position_id: number, app_step_id: number, document_type_id: number): Promise<any> => {
//   return http.post(`/document_approval/AddSignerToDocument`, {
//     department_id,
//     position_id,
//     app_step_id,
//     document_type_id,
//   });
// };