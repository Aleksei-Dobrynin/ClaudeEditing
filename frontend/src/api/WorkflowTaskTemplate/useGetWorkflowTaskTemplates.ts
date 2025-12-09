import http from "api/https";

export const getWorkflowTaskTemplates = (): Promise<any> => {
  return http.get("/WorkflowTaskTemplate/GetAll");
};

export const getWorkflowTaskTemplatesByWorkflow = (idWorkflow: number): Promise<any> => {
  return http.get(`/WorkflowTaskTemplate/GetByidWorkflow?idWorkflow=${idWorkflow}`);
};