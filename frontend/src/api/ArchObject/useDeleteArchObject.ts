import http from "api/https";

export const deleteArchObject = (id: number): Promise<any> => {
  return http.remove(`/ArchObject/Delete?id=${id}`, {});
};
