import http from "api/https";

export const getDictionaryLanguages = (): Promise<any> => {
  return http.get("/dictionary_language/GetAll");
};
