import http from "api/https";

export const getTemplCommsReminderCommsId = (template_id: number): Promise<any> => {
  return http.get(`/templ_comms_reminder/GetBytemplate_id?template_id=${template_id}`);
};
