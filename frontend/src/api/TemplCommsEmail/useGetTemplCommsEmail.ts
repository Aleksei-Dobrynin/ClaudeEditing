import http from "api/https";

export const getTemplCommsEmail = (id: number): Promise<any> => {
  return http.get(`/templ_comms_email/${id}`);
};
