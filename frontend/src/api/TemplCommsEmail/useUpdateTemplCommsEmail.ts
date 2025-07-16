import http from "api/https";
import { TemplCommsEmail } from "constants/TemplCommsEmail";

export const updateTemplCommsEmail = (data: TemplCommsEmail): Promise<any> => {
  return http.put(`/templ_comms_email/${data.id}`, data);
};
