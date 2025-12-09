import i18n from "i18n";
import * as yup from "yup";

export const schema = yup.object().shape({
  FileName: yup.string().required("Обязательное поле!"),
  comment: yup.string(),
});

export const validateField = async (name: string, value: any, context: any = {}) => {
  try {
    const schemas = yup.object().shape({
      [name]: schema.fields[name],
    });
    await schemas.validate({ [name]: value }, { abortEarly: false, context });
    return { isValid: true, error: "" };
  } catch (validationError) {
    return { isValid: false, error: validationError.errors[0] };
  }
};

export const validate = async (data: any, context: any = {}) => {
  try {
    await schema.validate(data, { abortEarly: false, context });
    return { isValid: true, errors: {} };
  } catch (validationErrors) {
    let errors: any = {};
    validationErrors.inner.forEach((error: any) => {
      errors[error.path] = error.message;
    });
    return { isValid: false, errors };
  }
};