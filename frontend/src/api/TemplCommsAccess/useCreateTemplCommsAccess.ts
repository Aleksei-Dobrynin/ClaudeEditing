import http from "api/https";
import { TemplCommsAccess } from "constants/TemplCommsAccess";

export const createTemplCommsAccess = (data: TemplCommsAccess): Promise<any> => {
  return http.post(`/templ_comms_access`, data);
};
