import http from "api/https";

export const deleteWorkflow = (id: number): Promise<any> => {
  return http.remove(`/Workflow/Delete?id=${id}`, {});
};
