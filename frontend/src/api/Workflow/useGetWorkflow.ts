import http from "api/https";

export const getWorkflow = (id: number): Promise<any> => {
  return http.get(`/Workflow/GetOneById?id=${id}`);
};
