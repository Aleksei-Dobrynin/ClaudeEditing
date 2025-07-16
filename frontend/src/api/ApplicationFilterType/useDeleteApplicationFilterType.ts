import http from "api/https";

export const deleteApplicationFilterType = (id: number): Promise<any> => {
  return http.remove(`/ApplicationFilterType/Delete?id=${id}`, {});
};
