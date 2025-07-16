import http from "api/https";

export const deleteService = (id: number): Promise<any> => {
  return http.remove(`/Service/Delete?id=${id}`, {});
};
