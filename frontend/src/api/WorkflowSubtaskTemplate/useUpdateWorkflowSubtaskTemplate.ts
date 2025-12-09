import http from "api/https";
import { WorkflowSubtaskTemplate } from "../../constants/WorkflowSubtaskTemplate";

export const updateWorkflowSubtaskTemplate = (data: WorkflowSubtaskTemplate): Promise<any> => {
  return http.put(`/WorkflowSubtaskTemplate/Update`, data);
};
