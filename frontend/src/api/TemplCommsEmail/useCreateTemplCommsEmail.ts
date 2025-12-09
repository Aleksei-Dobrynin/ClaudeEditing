import http from "api/https";
import { TemplCommsEmail } from "constants/TemplCommsEmail";

export const createTemplCommsEmail = (data: TemplCommsEmail): Promise<any> => {
  return http.post(`/templ_comms_email`, data);
};
