import http from "api/https";

export const getWorkflows = (): Promise<any> => {
  return http.get("/Workflow/GetAll");
};