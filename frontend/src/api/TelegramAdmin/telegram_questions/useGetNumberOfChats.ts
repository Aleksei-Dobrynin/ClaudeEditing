import http from "api/https";

export const GetNumberOfChats = (): Promise<any> => {
  return http.get("/telegram_questions_chats/GetNumberOfChats");
};