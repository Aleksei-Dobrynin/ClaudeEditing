import http from "api/https";

export const getWorkflowTaskTemplate = (id: number): Promise<any> => {
  return http.get(`/WorkflowTaskTemplate/GetOneById?id=${id}`);
};
