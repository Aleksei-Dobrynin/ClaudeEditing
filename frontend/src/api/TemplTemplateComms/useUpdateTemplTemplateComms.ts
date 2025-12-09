import http from "api/https";
import { TemplTemplateComms } from "constants/TemplTemplateComms";

export const updateTemplTemplateComms = (data: TemplTemplateComms): Promise<any> => {
  return http.put(`/templ_template_comms/${data.id}`, data);
};
