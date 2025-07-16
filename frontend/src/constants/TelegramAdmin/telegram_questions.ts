export type telegram_questions = {

  id: number;
  name: string;
  idSubject: number;
  answer: string;
  file_id?: number;
  answer_kg: string;
  name_kg: string;
  document?: File[];
};