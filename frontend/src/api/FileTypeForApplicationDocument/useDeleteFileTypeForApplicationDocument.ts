import http from "api/https";

export const deleteFileTypeForApplicationDocument = (id: number): Promise<any> => {
  return http.remove(`/FileTypeForApplicationDocument/Delete?id=${id}`, {});
};
