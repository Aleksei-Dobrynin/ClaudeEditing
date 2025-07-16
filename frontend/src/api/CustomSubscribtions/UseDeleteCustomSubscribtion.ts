import http from "api/https";

export const deleteCustomSubscribtion = (id: number): Promise<any> => {
  return http.remove(`/CustomSubscribtion/Delete?id=${id}`, {});
};