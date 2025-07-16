import * as yup from "yup";

export const schema = yup.object().shape({
  application_discount_percentage: yup
    .number()
    .nullable()
    .min(0, "Минимальное значение 0")
    .max(100, "Минимальное значение 100"),
  application_discount_value: yup
    .number()
    .nullable()
    .min(0, "Минимальная скидка 0")
    .test("max-discount-value", `Скидки не может превышать 'Сумму без скидки'`,
      function (value) {
        const { application_sum_wo_discount } = this.options.context || {};
        if (application_sum_wo_discount === undefined || value === undefined) return true;
        return value <= application_sum_wo_discount;
    })
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
