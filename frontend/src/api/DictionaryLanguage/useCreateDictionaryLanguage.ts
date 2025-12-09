import http from "api/https";
import { DictionaryLanguage } from "constants/DictionaryLanguage";

export const createDictionaryLanguage = (data: DictionaryLanguage): Promise<any> => {
  return http.post(`/dictionary_language`, data);
};
