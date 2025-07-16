import http from "api/https";

export const getTemplCommsAccess = (id: number): Promise<any> => {
  return http.get(`/templ_comms_access/${id}`);
};
