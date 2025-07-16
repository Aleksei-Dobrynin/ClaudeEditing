interface BaseField {
    key: string; // Уникальный идентификатор поля
    label: string; // Текст метки поля
    required?: boolean; // Указывает, является ли поле обязательным
    type: "text" | "number" | "email" | "date" | "group"; // Тип поля
  }
  
  interface SimpleField extends BaseField {
    type: "text" | "number" | "email" | "date"; // Простые типы полей
  }
  
  interface GroupField extends BaseField {
    type: "group"; // Указывает, что это группа полей
    fields: FieldConfig[]; // Вложенные поля
  }

export type FieldConfig = SimpleField | GroupField;