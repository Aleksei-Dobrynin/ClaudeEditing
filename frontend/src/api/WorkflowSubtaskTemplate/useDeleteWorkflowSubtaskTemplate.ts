import http from "api/https";

export const deleteWorkflowSubtaskTemplate = (id: number): Promise<any> => {
  return http.remove(`/WorkflowSubtaskTemplate/Delete?id=${id}`, {});
};
