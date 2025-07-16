import http from "api/https";

export const deleteDistrict = (id: number): Promise<any> => {
  return http.remove(`/District/Delete?id=${id}`, {});
};
