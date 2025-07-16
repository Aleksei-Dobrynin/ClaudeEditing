import * as yup from "yup";

export const schema = yup.object().shape({
  structure_id: yup.number().notOneOf([0], "Обязательное поле").required("Обязательное поле"),
  application_id: yup.number().notOneOf([0], "Required field").required("Required field"),
  sum_wo_discount: yup.number().moreThan(0, "Сумма должна быть больше 0").required("Введите сумму").typeError("Введите сумму"),
  // discount_percentage: yup
  //   .number()
  //   .min(0, "Минимальное значение 0")
  //   .max(100, "Минимальное значение 100")
  //   .required("Введите значение от 0 до 100")
  //   .typeError("Введите значение от 0 до 100"),
  // discount_value: yup
  //   .number()
  //   .min(0, "Минимальная скидка 0")
  //   .test("max-discount-value", `Скидки не может превышать 'Сумму без скидки'`,
  //     function (value) {
  //       const { sum_wo_discount } = this.options.context || {};
  //       if (sum_wo_discount === undefined || value === undefined) return true;
  //       return value <= sum_wo_discount;
  //     })
  //   .required("Введите скидку")
  //   .typeError("Введите скидку"),
  // reason: yup
  //   .string()
  //   .test(
  //     "reason-required",
  //     "Необходимо указать причину, если скидка задана",
  //     function (value) {
  //       const { discount_percentage, discount_value } = this.parent;
  //       if ((discount_percentage > 0 || discount_value > 0) && !value) {
  //         return false;
  //       }
  //       return true;
  //     }
  //   )
  //   .nullable(),
  head_structure_id: yup.number().notOneOf([0], "Обязательное поле").required("Обязательное поле"),
  implementer_id: yup.number().notOneOf([0], "Обязательное поле").required("Обязательное поле"),
  FileName: yup
    .string()
    .nullable()
    .test(
      'not-empty-string',
      'Обязательное поле',
      (value) => value === null || (typeof value === 'string' && value.trim() !== '')
    )
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
