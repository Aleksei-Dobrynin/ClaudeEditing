import * as yup from "yup";

export const schema = yup.object().shape({
  description: yup.string(),
  employee_id: yup.number().nullable(),
  head_structure_id: yup.number().nullable(),
  archive_object_id: yup.number().nullable(),
  event_type_id: yup.number().nullable(),
  event_date: yup.date().nullable(),
  structure_id: yup.number().nullable(),
  application_id: yup.number().nullable(),
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