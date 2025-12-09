import http from "api/https";

export const getTemplCommsFooterCommsId = (template_comms_id: number): Promise<any> => {
  return http.get(`/templ_comms_footer/GetBytemplate_comms_id?template_comms_id=${template_comms_id}`);
};
