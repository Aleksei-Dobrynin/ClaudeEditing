import http from "api/https";

export const getSubject = (id: number): Promise<any> => {
  return http.get(`/telegram_subjects/${id}`);
};