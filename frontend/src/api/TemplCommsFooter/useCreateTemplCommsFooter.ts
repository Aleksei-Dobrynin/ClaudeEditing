import http from "api/https";
import { TemplCommsFooter } from "constants/TemplCommsFooter";

export const createTemplCommsFooter = (data: TemplCommsFooter): Promise<any> => {
  return http.post(`/templ_comms_footer`, data);
};
