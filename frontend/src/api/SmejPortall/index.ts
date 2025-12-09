import http from "api/https";
import { SmejPortalOrganization, SmejPortalApprovalRequest } from "./models";

// Response типы
export interface OrganizationDataResponse {
  data: SmejPortalOrganization[];
  status: number;
}

export interface ApprovalRequestDataResponse {
  data: SmejPortalApprovalRequest;
  status: number;
}

/**
 * Получить данные всех организаций из портала СМЭЖ
 * @returns Promise с массивом организаций
 */
export const getAllOrganizationData = (): Promise<any> => {
  return http.get("/SmejPortal/GetAllOrganizationData");
};

/**
 * Получить данные заявки на согласование по номеру заявления
 * @param number - Номер заявления (bga_application_number)
 * @returns Promise с данными заявки на согласование
 */
export const getApprovalRequestByApplicationNumber = (
  number: string
): Promise<any> => {
  return http.get(
    `/SmejPortal/GetByApplicationNumberApprovalRequestData?number=${encodeURIComponent(number)}`
  );
};