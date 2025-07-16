import http from "api/https";
import { ApplicationDocumentType } from "../../constants/ApplicationDocumentType";

export const updateApplicationDocumentType = (data: ApplicationDocumentType): Promise<any> => {
  return http.put(`/ApplicationDocumentType/Update`, data);
};
