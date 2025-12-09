import * as yup from "yup";
import i18n from "../../../i18n";
export const schema = yup.object().shape({

  // employee_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  allow_notification: yup.boolean().default(false),
  type_id: yup.number().notOneOf([0], () => i18n.t("message:error.fieldRequired")).required(() => i18n.t("message:error.fieldRequired")),
  value: yup.string().required(() => i18n.t("message:error.fieldRequired")).required(() => i18n.t("message:error.fieldRequired")).min(1, () => i18n.t("message:error.fieldRequired")),
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
