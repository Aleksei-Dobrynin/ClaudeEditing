import http from "api/https";

export const getTemplCommsReminder = (id: number): Promise<any> => {
  return http.get(`/templ_comms_reminder/${id}`);
};
