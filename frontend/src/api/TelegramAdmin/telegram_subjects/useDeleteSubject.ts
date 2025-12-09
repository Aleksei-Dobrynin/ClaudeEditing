import http from "api/https";

export const deleteSubjects = (id: number): Promise<any> => {
  return http.remove(`/telegram_subjects/Delete?id=${id}`, {});
};