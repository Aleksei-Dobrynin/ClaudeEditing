import http from "api/https";

export const getTemplCommsFooter = (id: number): Promise<any> => {
  return http.get(`/templ_comms_footer/${id}`);
};
