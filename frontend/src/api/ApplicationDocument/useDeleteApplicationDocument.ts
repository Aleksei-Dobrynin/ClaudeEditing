import http from "api/https";

export const deleteApplicationDocument = (id: number): Promise<any> => {
  return http.remove(`/ApplicationDocument/Delete?id=${id}`, {});
};
