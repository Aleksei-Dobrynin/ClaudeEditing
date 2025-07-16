import http from "api/https";
import { faq_question } from "constants/faq_question";

export const createfaq_question = (data: faq_question): Promise<any> => {
  return http.post(`/faq_question`, data);
};

export const deletefaq_question = (id: number): Promise<any> => {
  return http.remove(`/faq_question/${id}`, {});
};

export const getfaq_question = (id: number): Promise<any> => {
  return http.get(`/faq_question/${id}`);
};

export const getfaq_questions = (): Promise<any> => {
  return http.get("/faq_question/GetAll");
};

export const updatefaq_question = (data: faq_question): Promise<any> => {
  return http.put(`/faq_question/${data.id}`, data);
};


