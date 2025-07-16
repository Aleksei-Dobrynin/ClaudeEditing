import http from "api/https";

export const getWorkflowSubtaskTemplate = (id: number): Promise<any> => {
  return http.get(`/WorkflowSubtaskTemplate/GetOneById?id=${id}`);
};
