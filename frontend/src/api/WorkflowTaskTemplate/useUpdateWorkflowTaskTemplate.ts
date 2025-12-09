import http from "api/https";
import { WorkflowTaskTemplate } from "../../constants/WorkflowTaskTemplate";

export const updateWorkflowTaskTemplate = (data: WorkflowTaskTemplate): Promise<any> => {
  return http.put(`/WorkflowTaskTemplate/Update`, data);
};
