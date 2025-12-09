import http from "api/https";

export const deleteTemplCommsFooter = (id: number): Promise<any> => {
  return http.remove(`/templ_comms_footer/${id}`, {});
};
