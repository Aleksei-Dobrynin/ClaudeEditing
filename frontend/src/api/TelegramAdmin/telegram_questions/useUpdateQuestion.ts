import http from "api/https";
import { telegram_questions } from "../../../constants/TelegramAdmin/telegram_questions";
import { FileType } from "../../../constants/Files";

export const updateQuestions = (data: telegram_questions, newFile: FileType[], oldFile: FileType[]): Promise<any> => {
  const formData = new FormData();
  for (let key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  if(newFile.length > 0) {
    newFile.forEach((item) => {
      formData.append("document.file[]", item.file);
    })
  }
  if (oldFile) {
    oldFile.forEach((item) => {
      formData.append("document.id", String(item.id));
    })
  }
  return http.put(`/telegram_questions/${data.id}`, formData);
};
