import http from "api/https";

export const deleteTag = (id: number): Promise<any> => {
  return http.remove(`/Tag/Delete?id=${id}`, {});
};
