import http from "api/https";

export const deleteArchiveObjectFile = (id: number): Promise<any> => {
  return http.remove(`/ArchiveObjectFile/Delete?id=${id}`, {});
};
