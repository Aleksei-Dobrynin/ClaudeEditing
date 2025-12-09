import http from "api/https";

export const deleteTemplCommsAccess = (id: number): Promise<any> => {
  return http.remove(`/templ_comms_access/${id}`, {});
};
