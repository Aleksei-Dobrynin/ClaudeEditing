import http from "api/https";

export const deleteFileForApplicationDocument = (id: number): Promise<any> => {
  return http.remove(`/FileForApplicationDocument/Delete?id=${id}`, {});
};
