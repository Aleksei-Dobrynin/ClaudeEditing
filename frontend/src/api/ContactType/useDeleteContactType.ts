import http from "api/https";

export const deleteContactType = (id: number): Promise<any> => {
  return http.remove(`/ContactType/Delete?id=${id}`, {});
};
