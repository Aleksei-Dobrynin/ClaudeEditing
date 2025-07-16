import http from "api/https";
import { DictionaryLanguage } from "constants/DictionaryLanguage";

export const updateDictionaryLanguage = (data: DictionaryLanguage): Promise<any> => {
  return http.put(`/dictionary_language/${data.id}`, data);
};
