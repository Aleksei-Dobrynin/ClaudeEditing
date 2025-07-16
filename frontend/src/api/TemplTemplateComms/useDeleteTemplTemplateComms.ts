import http from "api/https";

export const deleteTemplTemplateComms = (id: number): Promise<any> => {
  return http.remove(`/templ_template_comms/${id}`, {});
};
