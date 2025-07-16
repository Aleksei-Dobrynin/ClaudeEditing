import http from "api/https";

export const getTemplCommsAccessCommsId = (template_comms_id: number): Promise<any> => {
  return http.get(`/templ_comms_access/GetBytemplate_comms_id?template_comms_id=${template_comms_id}`);
};
