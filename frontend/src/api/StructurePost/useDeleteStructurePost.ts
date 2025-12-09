import http from "api/https";

export const deleteStructurePost = (id: number): Promise<any> => {
  return http.remove(`/StructurePost/Delete?id=${id}`, {});
};
