import http from "api/https";
import { ApplicationDocument } from "../../constants/ApplicationDocument";

export const updateApplicationDocument = (data: ApplicationDocument): Promise<any> => {
  return http.put(`/ApplicationDocument/Update`, data);
};
