import http from "api/https";

export const deleteApplicationRoad = (id: number): Promise<any> => {
  return http.remove(`/ApplicationRoad/Delete?id=${id}`, {});
};
