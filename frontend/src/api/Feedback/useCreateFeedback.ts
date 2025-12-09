import http from "api/https";

export const createFeedback = (data: any): Promise<any> => {
  return http.post(`/Feedback`, data);
};