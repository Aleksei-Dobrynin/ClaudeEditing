import http from "api/https";

export const deleteApplicationWorkDocument = (id: number): Promise<any> => {
  return http.remove(`/ApplicationWorkDocument/Delete?id=${id}`, {});
};

export const deactivateDocument = (id: number, reason: string): Promise<any> => {
  return http.post(`/ApplicationWorkDocument/DeactivateDocument`, { id, reason });
};
