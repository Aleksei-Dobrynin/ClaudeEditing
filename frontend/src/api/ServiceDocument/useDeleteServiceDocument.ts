import http from "api/https";

export const deleteServiceDocument = (id: number): Promise<any> => {
  return http.remove(`/ServiceDocument/Delete?id=${id}`, {});
};
