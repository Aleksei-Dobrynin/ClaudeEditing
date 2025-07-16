import http from "api/https";

export const getTemplTemplateComms = (id: number): Promise<any> => {
  return http.get(`/templ_template_comms/${id}`);
};
