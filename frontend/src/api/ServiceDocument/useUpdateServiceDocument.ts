import http from "api/https";
import { ServiceDocument } from "../../constants/ServiceDocument";

export const updateServiceDocument = (data: ServiceDocument): Promise<any> => {
  return http.put(`/ServiceDocument/Update`, data);
};
