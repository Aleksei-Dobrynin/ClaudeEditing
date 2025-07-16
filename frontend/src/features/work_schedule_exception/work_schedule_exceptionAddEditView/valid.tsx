import * as yup from "yup";
import store from "./store";

export const schema = yup.object().shape({

  date_start: yup
    .date()
    .required("Обязательное поле")
    .typeError("Укажите правильное время"),
  date_end: yup
    .date()
    .required("Обязательное поле")
    .typeError("Укажите правильное время")
    .when("date_start", ([], schema) => {
      return schema.min(new Date(store.date_start) ,'Дата окончания не может быть раньше начала');
    }),
  name: yup.string()
    .required("Обязательное поле"),
  schedule_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  is_holiday: yup.boolean().default(false),
  // time_start: yup
  //   .date()
  //   .required("Обязательное поле")
  //   .typeError("Укажите правильное время"),
  // time_end: yup
  //   .date()
  //   .required("Обязательное поле")
  //   .typeError("Укажите правильное время"),
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
