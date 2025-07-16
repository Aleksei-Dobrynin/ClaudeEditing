import http from "api/https";
import { TemplCommsFooter } from "constants/TemplCommsFooter";

export const updateTemplCommsFooter = (data: TemplCommsFooter): Promise<any> => {
  return http.put(`/templ_comms_footer/${data.id}`, data);
};
