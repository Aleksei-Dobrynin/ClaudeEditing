import * as yup from "yup";
import i18n from "i18next";

export const schema = yup.object().shape({
  
  name: yup.string(),
  description: yup.string(),
  code: yup.string(),
  queueNumber: yup.number()
    .typeError(() => i18n.t("message:error.onlyDigits"))
    .notOneOf([0], () => i18n.t("message:error.fieldRequired")).required(() => i18n.t("message:error.fieldRequired")),
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
