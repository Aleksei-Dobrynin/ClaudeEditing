import http from "api/https";

export const getQuestionById = (id: number): Promise<any> => {
  return http.get(`/telegram_questions/${id}`);
};