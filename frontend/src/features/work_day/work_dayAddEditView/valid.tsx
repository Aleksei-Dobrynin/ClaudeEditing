import * as yup from "yup";
import store from "./store";

export const schema = yup.object().shape({

  week_number: yup.number()
    .notOneOf([0], "Обязательное поле")
    .required("Обязательное поле"),
  time_start: yup
    .date()
    .required("Обязательное поле")
    .typeError("Укажите правильное время"),
  time_end: yup
    .date()
    .required("Обязательное поле")
    .typeError("Укажите правильное время")
    .when("time_start", ([], schema) => {
      return schema.min(new Date(store.time_start), 'Время окончания не может быть раньше начала');
    }),
  schedule_id: yup.number().notOneOf([0], "Required field").required("Required field"),
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

export const validate = async (data: any) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationErrors) {
    let errors: any = {};
    validationErrors.inner.forEach((error: any) => {
      errors[error.path] = error.message;
    });
    return { isValid: false, errors };
  }
};
