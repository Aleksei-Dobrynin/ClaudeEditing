import * as yup from "yup";

export const schema = yup.object().shape({
  template_comms_id: yup
    .number()
    .notOneOf([0], "Required field") // Проверка на значение, не равное 0
    .required("Name is required"),
    language_id: yup
    .number()
    .notOneOf([0], "Required field") // Проверка на значение, не равное 0
    .required("Name is required"),
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
