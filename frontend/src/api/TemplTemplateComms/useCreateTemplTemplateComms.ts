import http from "api/https";
import { TemplTemplateComms } from "constants/TemplTemplateComms";

export const createTemplTemplateComms = (data: TemplTemplateComms): Promise<any> => {
  return http.post(`/templ_template_comms`, data);
};
