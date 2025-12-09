import http from "api/https";

export const getQuestionsByIdSubject = (id: number): Promise<any> => {
  return http.get(`/telegram_questions/GetByIdSubject?id=${id}`);
};