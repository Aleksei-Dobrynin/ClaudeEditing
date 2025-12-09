import i18n from "i18n";
import * as yup from "yup";

export const schema = yup.object().shape({
  first_name: yup.string().required(() => i18n.t("message:error.emptyFirstName")),
  last_name: yup.string().required(() => i18n.t("message:error.emptyLastName")),
  // Добавляем валидацию для PIN
  pin: yup
    .string()
    .required(() => i18n.t("message:error.emptyPin"))
    .matches(/^\d+$/, () => i18n.t("message:error.pinOnlyNumbers"))
    .length(14, () => i18n.t("message:error.pinLength")),
});

export const schemaChangePassword = yup.object().shape({
  CurrentPassword: yup.string().required(() => i18n.t("message:error.emptyPassword")),
  NewPassword: yup.string().required(() => i18n.t("message:error.emptyNewPassword")),
  ConfirmPassword: yup.string().required(() => i18n.t("message:error.emptyConfirmPassword"))
    .oneOf([yup.ref('NewPassword'), null], () => i18n.t("message:error.passwordsDoNotMatch")),
});

export const validateFieldUserName = async (name: string, value: any) => {
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

export const validateFieldPin = async (name: string, value: any) => {
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

export const validateFieldPassword = async (name: string, value: any) => {
  try {
    const schemas = yup.object().shape({
      [name]: schemaChangePassword.fields[name],
    });
    await schemas.validate({ [name]: value }, { abortEarly: false });
    return { isValid: true, error: "" };
  } catch (validationError) {
    return { isValid: false, error: validationError.errors[0] };
  }
};

export const validatePassword = async (data: any) => {
  try {
    await schemaChangePassword.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationErrors) {
    let errors: any = {};
    validationErrors.inner.forEach((error: any) => {
      errors[error.path] = error.message;
    });
    return { isValid: false, errors };
  }
};