import http from "api/https";
import { TemplCommsAccess } from "constants/TemplCommsAccess";

export const updateTemplCommsAccess = (data: TemplCommsAccess): Promise<any> => {
  return http.put(`/templ_comms_access/${data.id}`, data);
};
