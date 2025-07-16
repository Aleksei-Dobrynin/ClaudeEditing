import http from "api/https";

export const deleteApplication = (id: number): Promise<any> => {
  return http.remove(`/Application/Delete?id=${id}`, {});
};
