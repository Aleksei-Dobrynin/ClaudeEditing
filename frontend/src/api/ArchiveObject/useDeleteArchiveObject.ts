import http from "api/https";

export const deleteArchiveObject = (id: number): Promise<any> => {
  return http.remove(`/ArchiveObject/Delete?id=${id}`, {});
};
