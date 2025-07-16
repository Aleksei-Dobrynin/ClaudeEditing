import http from "api/https";

export const getWorkflowSubtaskTemplates = (): Promise<any> => {
  return http.get("/WorkflowSubtaskTemplate/GetAll");
};

export const getWorkflowSubtaskTemplatesByWorkflow = (idWorkflowTaskTemplate: number): Promise<any> => {
  return http.get(`/WorkflowSubtaskTemplate/GetByidWorkflowTaskTemplate?idWorkflowTaskTemplate=${idWorkflowTaskTemplate}`);
};