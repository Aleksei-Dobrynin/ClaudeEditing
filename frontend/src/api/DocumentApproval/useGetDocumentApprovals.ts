// Путь: frontend/src/api/DocumentApproval/useGetDocumentApprovals.ts

import http from "api/https";

/**
 * Параметры для получения согласований с исполнителями
 */
export interface GetApprovalsWithAssigneesParams {
  /** ID заявки */
  applicationId: number;
  
  /** ID этапа (опционально) */
  stepId?: number;
}

/**
 * Получает согласования документов с назначенными исполнителями
 * 
 * Этот метод возвращает список подписантов (document_approval) 
 * с добавленным полем assigned_approvers, которое содержит 
 * реальных сотрудников из application_task_assignee
 * 
 * @param params - Параметры запроса
 * @returns Promise с данными согласований
 * 
 * @example
 * const approvals = await getDocumentApprovalsWithAssignees({ 
 *   applicationId: 123,
 *   stepId: 45 // опционально
 * });
 */
export const getDocumentApprovalsWithAssignees = (
  params: GetApprovalsWithAssigneesParams
): Promise<any> => {
  return http.get(`/document_approval/GetByApplicationWithAssignees`, {
    params: {
      applicationId: params.applicationId,
      stepId: params.stepId
    }
  });
};

/**
 * Получает согласования документов (старый метод без исполнителей)
 * Оставлен для обратной совместимости
 */
export const getDocumentApprovals = (
  applicationId: number
): Promise<any> => {
  return http.get(`/document_approval/GetByApplication`, {
    params: { applicationId }
  });
};

/**
 * Получает согласования для конкретного документа
 */
export const getDocumentApprovalsByDocumentId = (
  documentId: number
): Promise<any> => {
  return http.get(`/document_approval/GetByDocumentId`, {
    params: { documentId }
  });
};

/**
 * Создает новое согласование
 */
export const createDocumentApproval = (
  data: {
    app_document_id?: number | null;
    file_sign_id?: number | null;
    department_id: number;
    position_id: number;
    status?: string;
    approval_date?: string | null;
    comments?: string;
    app_step_id?: number;
    document_type_id?: number;
    order_number?: number;
  }
): Promise<any> => {
  return http.post(`/document_approval`, data);
};

/**
 * Обновляет согласование
 */
export const updateDocumentApproval = (
  id: number,
  data: {
    status?: string;
    approval_date?: string | null;
    comments?: string;
    order_number?: number;
    [key: string]: any;
  }
): Promise<any> => {
  return http.put(`/document_approval/${id}`, data);
};

/**
 * Удаляет согласование
 */
export const deleteDocumentApproval = (id: number): Promise<any> => {
  return http.remove(`/document_approval/${id}`, {});
};