import http from "api/https";
import { ServiceDocument } from "../../constants/ServiceDocument";

export const createServiceDocument = (data: ServiceDocument): Promise<any> => {
  return http.post(`/ServiceDocument/Create`, data);
};
