import http from "api/https";

export const deleteArchiveLogStatus = (id: number): Promise<any> => {
  return http.remove(`/ArchiveLogStatus/Delete?id=${id}`, {});
};
