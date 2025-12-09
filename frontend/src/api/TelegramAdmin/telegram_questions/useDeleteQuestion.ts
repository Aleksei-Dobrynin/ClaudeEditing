import http from "api/https";

export const deleteQuestion = (id: number): Promise<any> => {
  return http.remove(`/telegram_questions/Delete?id=${id}`, {});
};