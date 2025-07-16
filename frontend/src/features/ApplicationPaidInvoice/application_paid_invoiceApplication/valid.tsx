import * as yup from "yup";

export const schema = yup.object().shape({

  date: yup
    .date()
    .nullable()
    .required("Обязательное поле")
    .typeError("Введите правильную дату"),
  payment_identifier: yup.string(),
  sum: yup.number().min(1, "Минимальная сумма 1").max(100000000, "Максимальная сумма 100000000").required("Введите сумму").typeError("Введите сумму"),
  application_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  bank_identifier: yup.string(),
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
