import http from "api/https";
import { WorkflowSubtaskTemplate } from "../../constants/WorkflowSubtaskTemplate";

export const createWorkflowSubtaskTemplate = (data: WorkflowSubtaskTemplate): Promise<any> => {
  return http.post(`/WorkflowSubtaskTemplate/Create`, data);
};
