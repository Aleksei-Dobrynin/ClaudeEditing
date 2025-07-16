import http from "api/https";

export const deleteWorkflowTaskTemplate = (id: number): Promise<any> => {
  return http.remove(`/WorkflowTaskTemplate/Delete?id=${id}`, {});
};
