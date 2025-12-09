import http from "api/https";

export const getTemplCommsEmailCommsId = (template_comms_id: number): Promise<any> => {
  return http.get(`/templ_comms_email/GetBytemplate_comms_id?template_comms_id=${template_comms_id}`);
};
