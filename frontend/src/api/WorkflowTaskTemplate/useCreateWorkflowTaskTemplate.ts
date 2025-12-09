import http from "api/https";
import { WorkflowTaskTemplate } from "../../constants/WorkflowTaskTemplate";

export const createWorkflowTaskTemplate = (data: WorkflowTaskTemplate): Promise<any> => {
  return http.post(`/WorkflowTaskTemplate/Create`, data);
};
