import * as yup from "yup";

export const schema = yup.object().shape({
  
  step_type: yup.string(),
  path_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  responsible_org_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  name: yup.string(),
  description: yup.string(),
  order_number: yup.number().notOneOf([0], "Required field").required("Required field"),
  is_required: yup.boolean().default(false),
  estimated_days: yup.number().notOneOf([0], "Required field").required("Required field"),
  wait_for_previous_steps: yup.boolean().default(false), 
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
