import http from "api/https";

export const deleteApplicationDocumentType = (id: number): Promise<any> => {
  return http.remove(`/ApplicationDocumentType/Delete?id=${id}`, {});
};
