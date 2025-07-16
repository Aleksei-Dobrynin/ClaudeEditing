import http from "api/https";

export const deleteTemplCommsEmail = (id: number): Promise<any> => {
  return http.remove(`/templ_comms_email/${id}`, {});
};
