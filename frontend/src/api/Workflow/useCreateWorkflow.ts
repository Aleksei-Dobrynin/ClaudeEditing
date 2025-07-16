import http from "api/https";
import { Workflow } from "../../constants/Workflow";

export const createWorkflow = (data: Workflow): Promise<any> => {
  return http.post(`/Workflow/Create`, data);
};
