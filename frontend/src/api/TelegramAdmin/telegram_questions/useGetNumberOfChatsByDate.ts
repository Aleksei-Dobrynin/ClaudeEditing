import http from "api/https";

export const GetNumberOfChatsByDate = (startDate: string, endDate: string): Promise<any> => {
  return http.get(`/telegram_questions_chats/GetNumberOfChatsByDate?startDate=${startDate}${endDate ? "&endDate=" + endDate : ""}`);
};