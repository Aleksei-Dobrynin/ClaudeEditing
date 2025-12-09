import http from "api/https";

export const getDictionaryLanguage = (id: number): Promise<any> => {
  return http.get(`/dictionary_language/${id}`);
};
