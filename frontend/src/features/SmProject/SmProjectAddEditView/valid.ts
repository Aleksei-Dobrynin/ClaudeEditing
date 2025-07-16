import * as yup from "yup";

export const schema = yup.object().shape({
  test: yup.boolean().default(false),
  name: yup.string().when("test", ([test], schema) => {
    return test ? schema : schema.required('Name is required');
  }),
  // {
  //   then: yup.string().required('Name is required'), // Поле name обязательно
  //   is: "", // Условие: если test равно false
  //   otherwise: yup.string() // Иначе поле name не обязательно
  // }),
  projecttype_id: yup
    .number()
    .notOneOf([0], "Required field") // Проверка на значение, не равное 0
    .nullable() // Допускает `null` как валидное значение
    .test("is-not-null", "Field must not be null", (value) => value !== null),
  status_id: yup.number().required("Status is required"),
  min_responses: yup.number().min(0, "Minimum responses must be 0 or more"),
  date_end: yup
    .date()
    .nullable()
    .required("date_end is required")
    .typeError("Please provide a valid date"),
  entity_id: yup.number().required("Entity is required"),
  frequency_id: yup.number().required("Frequency is required"),
  is_triggers_required: yup.boolean(),
  date_attribute_milestone_id: yup.number().nullable(),
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
