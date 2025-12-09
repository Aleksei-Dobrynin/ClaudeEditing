import http from "api/https";
import { ApplicationDocumentType } from "../../constants/ApplicationDocumentType";

export const createApplicationDocumentType = (data: ApplicationDocumentType): Promise<any> => {
  return http.post(`/ApplicationDocumentType/Create`, data);
};
