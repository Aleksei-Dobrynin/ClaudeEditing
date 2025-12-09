import http from "api/https";

export const deleteStructure = (id: number): Promise<any> => {
  return http.remove(`/OrgStructure/Delete?id=${id}`, {});
};
