import http from "api/https";
import { Workflow } from "../../constants/Workflow";

export const updateWorkflow = (data: Workflow): Promise<any> => {
  return http.put(`/Workflow/Update`, data);
};
