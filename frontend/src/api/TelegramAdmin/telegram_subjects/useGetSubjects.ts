import http from "api/https";

export const getSubjects = (): Promise<any> => {
  return http.get("/telegram_subjects/GetAll");
};