import http from "api/https";

export const getTemplTemplateCommss = (): Promise<any> => {
  return http.get("/templ_template_comms/GetAll");
};
