import * as yup from "yup";
import store from "./store";

export const schema = yup.object().shape({
  application_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  description: yup.string(),
  sum: yup.number().min(0, "Введите сумму").required("Введите сумму").typeError("Введите сумму"),
  startDate: yup
  .date()
  .required("Обязательное поле")
  .test("is-valid-date", "Дата начала больше даты окончания", function (value) {
    const endDate = store.endDate ? new Date(store.endDate) : null; // Проверяем, что endDate не пустая
    if (!value || !endDate) {
      return true;
    }
    return value <= endDate;
  }),


  endDate: yup
    .date()
    .required("Обязательное поле")
    .test("is-valid-date", "Дата конца меньше даты начала", function (value) {
      const startDate = store.startDate ? new Date(store.startDate) : null; 
      if (!value || !startDate) {
        return true;
      }
      return value >= startDate;
    }),
});

export const validateField = async (name: string, value: any) => {
  try {
    const schemas = yup.object().shape({
      [name]: schema.fields[name],
    });
    await schemas.validate({ [name]: value }, { abortEarly: false });
    return { isValid: true, error: "" };
  } catch (validationError) {
    return { isValid: false, error: validationError.errors[0] };
  }
};