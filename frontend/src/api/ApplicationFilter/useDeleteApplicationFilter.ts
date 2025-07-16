import http from "api/https";

export const deleteApplicationFilter = (id: number): Promise<any> => {
  return http.remove(`/ApplicationFilter/Delete?id=${id}`, {});
};
