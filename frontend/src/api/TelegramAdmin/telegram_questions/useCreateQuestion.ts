import http from "api/https";
import { telegram_questions } from "../../../constants/TelegramAdmin/telegram_questions";


export const createQuestions = (data: telegram_questions, file: File[]): Promise<any> => {
  const formData = new FormData();
  for (let key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  file.forEach((item) => {
    formData.append("document.file", item);
  })
  return http.post(`/telegram_questions/Create`, formData);
};