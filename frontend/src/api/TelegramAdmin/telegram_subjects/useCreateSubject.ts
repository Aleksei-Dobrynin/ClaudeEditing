import http from "api/https";
import { telegram_subject } from "../../../constants/TelegramAdmin/telegram_subject";


export const createSubject = (data: telegram_subject): Promise<any> => {
  return http.post(`/telegram_subjects/Create`, data);
};
