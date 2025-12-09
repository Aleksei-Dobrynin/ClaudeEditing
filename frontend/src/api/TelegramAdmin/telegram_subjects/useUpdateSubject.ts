import http from "api/https";
import { telegram_subject } from "../../../constants/TelegramAdmin/telegram_subject";

export const updateSubject = (data: telegram_subject): Promise<any> => {
  return http.put(`/telegram_subjects/${data.id}`, data);
};
