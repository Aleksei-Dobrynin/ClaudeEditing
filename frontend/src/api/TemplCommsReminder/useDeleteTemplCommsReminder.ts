import http from "api/https";

export const deleteTemplCommsReminder = (id: number): Promise<any> => {
  return http.remove(`/templ_comms_reminder/${id}`, {});
};
