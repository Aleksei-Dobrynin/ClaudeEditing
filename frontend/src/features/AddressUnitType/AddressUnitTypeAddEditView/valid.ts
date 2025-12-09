import { CheckEmptyTextField, CheckEmptyLookup } from "components/ValidationHelper";
import store from "./store";
import i18n from 'i18next';

export const validate = async (event: { target: { name: string; value: any } }) => {
  // Валидация будет добавлена позже согласно требованиям
  // Сейчас просто возвращаем true для всех полей
  
  const canSave = true;
  
  console.log(canSave);
  return canSave;
};