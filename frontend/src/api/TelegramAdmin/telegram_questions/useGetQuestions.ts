import http from "api/https";

export const getQuestions = (): Promise<any> => {
  return http.get("/telegram_questions/GetAll");
};