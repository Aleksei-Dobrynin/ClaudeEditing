import http from "api/https";

export const deleteDictionaryLanguage = (id: number): Promise<any> => {
  return http.remove(`/dictionary_language/${id}`, {});
};
