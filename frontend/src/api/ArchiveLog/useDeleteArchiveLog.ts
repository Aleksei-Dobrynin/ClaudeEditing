import http from "api/https";

export const deleteArchiveLog = (id: number): Promise<any> => {
  return http.remove(`/ArchiveLog/Delete?id=${id}`, {});
};
