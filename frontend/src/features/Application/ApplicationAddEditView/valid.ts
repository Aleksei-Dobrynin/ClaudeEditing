import {
  CheckEmptyLookup,
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {

  let customer_id = "";
  if (event.target.name === "customer_id") {
    let customer_idErrors = [];
    CheckEmptyLookup(event.target.value, customer_idErrors);
    customer_id = customer_idErrors.join(", ");
    store.errorcustomer_id = customer_id;
  }

  let arch_object_id = "";
  if (event.target.name === "arch_object_id") {
    let arch_object_idErrors = [];
    CheckEmptyLookup(event.target.value, arch_object_idErrors);
    arch_object_id = arch_object_idErrors.join(", ");
    store.errorarch_object_id = arch_object_id;
  }

  let service_id = "";
  if (event.target.name === "service_id") {
    let service_idErrors = [];
    CheckEmptyLookup(event.target.value, service_idErrors);
    service_id = service_idErrors.join(", ");
    store.errorservice_id = service_id;
  }

  // Валидация данных клиента
  let pin = "";
  if (event.target.name === "pin") {
    let pinErrors = [];
    CheckEmptyTextField(event.target.value.pin, pinErrors);
    if (!event.target.value.is_foreign) {
      const pinValue = event.target.value.pin;
      if (pinValue) {
        const cleanPin = pinValue.replace(/\s/g, '');  // Убираем пробелы
        const pinRegex = /^[0-9]{14}$/;
        if (!pinRegex.test(cleanPin)) {
          pinErrors.push("ИНН должен содержать только цифры и быть длиной 14 символов.");
        }
      }
    } else {
      if (event.target.value.pin && event.target.value.pin.length < 5) {
        pinErrors.push("ИНН должен содержать минимум 5 символов");
      }
      // Валидация страны для иностранных клиентов
      let countryErrors = [];
      CheckEmptyLookup(event.target.value.foreign_country, countryErrors);
      if (countryErrors.length > 0) {
        store.customerErrors.foreign_country = countryErrors.join(", ");
      } else {
        store.customerErrors.foreign_country = "";
      }
    }
    pin = pinErrors.join(", ");
    store.customerErrors.pin = pin;
  }

  // Валидация полей физического лица
  let individual_surname = "";
  if (event.target.name === "individual_surname") {
    if (!store.customer.is_organization) {
      let individual_surnameErrors = [];
      CheckEmptyTextField(event.target.value, individual_surnameErrors);
      individual_surname = individual_surnameErrors.join(", ");
    }
    store.customerErrors.individual_surname = individual_surname;
  }

  let individual_name = "";
  if (event.target.name === "individual_name") {
    if (!store.customer.is_organization) {
      let individual_nameErrors = [];
      CheckEmptyTextField(event.target.value, individual_nameErrors);
      individual_name = individual_nameErrors.join(", ");
    }
    store.customerErrors.individual_name = individual_name;
  }

  let individual_secondname = "";
  if (event.target.name === "individual_secondname") {
    // Отчество не обязательное поле
    store.customerErrors.individual_secondname = individual_secondname;
  }

  // Валидация полей организации
  let full_name = "";
  if (event.target.name === "full_name") {
    if (store.customer.is_organization) {
      let full_nameErrors = [];
      CheckEmptyTextField(event.target.value, full_nameErrors);
      full_name = full_nameErrors.join(", ");
    }
    store.customerErrors.full_name = full_name;
  }

  let director = "";
  if (event.target.name === "director") {
    if (store.customer.is_organization) {
      let directorErrors = [];
      CheckEmptyTextField(event.target.value, directorErrors);
      director = directorErrors.join(", ");
    }
    store.customerErrors.director = director;
  }

  let organization_type_id = "";
  if (event.target.name === "organization_type_id") {
    if (store.customer.is_organization) {
      let orgTypeErrors = [];
      CheckEmptyLookup(event.target.value, orgTypeErrors);
      organization_type_id = orgTypeErrors.join(", ");
    }
    store.customerErrors.organization_type_id = organization_type_id;
  }

  let ugns = "";
  if (event.target.name === "ugns") {
    if (store.customer.is_organization) {
      let ugnsErrors = [];
      CheckEmptyTextField(event.target.value, ugnsErrors);
      ugns = ugnsErrors.join(", ");
    }
    store.customerErrors.ugns = ugns;
  }

  let registration_number = "";
  if (event.target.name === "registration_number") {
    if (store.customer.is_organization) {
      let regNumErrors = [];
      CheckEmptyTextField(event.target.value, regNumErrors);
      registration_number = regNumErrors.join(", ");
    }
    store.customerErrors.registration_number = registration_number;
  }

  // Валидация банковских реквизитов
  let payment_account = "";
  if (event.target.name === "payment_account") {
    if (store.customer.is_organization && event.target.value) {
      let accountErrors = [];
      const cleanAccount = event.target.value.replace(/\s/g, '');
      if (cleanAccount && !/^[0-9]{14,20}$/.test(cleanAccount)) {
        accountErrors.push("Расчетный счет должен содержать от 14 до 20 цифр");
      }
      payment_account = accountErrors.join(", ");
    }
    store.customerErrors.payment_account = payment_account;
  }

  let bank = "";
  if (event.target.name === "bank") {
    if (store.customer.is_organization && store.customer.payment_account) {
      let bankErrors = [];
      CheckEmptyTextField(event.target.value, bankErrors);
      bank = bankErrors.join(", ");
    }
    store.customerErrors.bank = bank;
  }

  let bik = "";
  if (event.target.name === "bik") {
    if (store.customer.is_organization && event.target.value) {
      let bikErrors = [];
      const cleanBik = event.target.value.replace(/\s/g, '');
      if (cleanBik && !/^[0-9]{9}$/.test(cleanBik)) {
        bikErrors.push("БИК должен содержать 9 цифр");
      }
      bik = bikErrors.join(", ");
    }
    store.customerErrors.bik = bik;
  }

  // Валидация адреса
  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];
    CheckEmptyTextField(event.target.value, addressErrors);
    address = addressErrors.join(", ");
    store.customerErrors.address = address;
  }

  // Валидация документов удостоверяющих личность
  let identity_document_type_id = "";
  if (event.target.name === "identity_document_type_id") {
    if (!store.customer.is_organization) {
      let docTypeErrors = [];
      CheckEmptyLookup(event.target.value, docTypeErrors);
      identity_document_type_id = docTypeErrors.join(", ");
    }
    store.customerErrors.identity_document_type_id = identity_document_type_id;
  }

  let document_serie = "";
  if (event.target.name === "document_serie") {
    if (!store.customer.is_organization) {
      let docSerieErrors = [];
      CheckEmptyTextField(event.target.value, docSerieErrors);
      document_serie = docSerieErrors.join(", ");
    }
    store.customerErrors.document_serie = document_serie;
  }

  let document_date_issue = "";
  if (event.target.name === "document_date_issue") {
    if (!store.customer.is_organization && store.customer.document_serie) {
      let docDateErrors = [];
      if (!event.target.value) {
        docDateErrors.push("Дата выдачи документа обязательна");
      }
      document_date_issue = docDateErrors.join(", ");
    }
    store.customerErrors.document_date_issue = document_date_issue;
  }

  let document_whom_issued = "";
  if (event.target.name === "document_whom_issued") {
    if (!store.customer.is_organization) {
      let docIssuedErrors = [];
      CheckEmptyTextField(event.target.value, docIssuedErrors);
      document_whom_issued = docIssuedErrors.join(", ");
    }
    store.customerErrors.document_whom_issued = document_whom_issued;
  }

  // Валидация контактной информации
  let sms_1 = "";
  if (event.target.name === "sms_1") {
    if (event.target.value) {
      let sms1Errors = [];
      const digitsOnly = event.target.value.replace(/[^\d]/g, '');
      if (digitsOnly.length < 9) {
        sms1Errors.push("Телефон должен содержать минимум 9 цифр");
      }
      sms_1 = sms1Errors.join(", ");
    }
    store.customerErrors.sms_1 = sms_1;
  }

  let sms_2 = "";
  if (event.target.name === "sms_2") {
    if (event.target.value) {
      let sms2Errors = [];
      const digitsOnly = event.target.value.replace(/[^\d]/g, '');
      if (digitsOnly.length < 9) {
        sms2Errors.push("Телефон должен содержать минимум 9 цифр");
      }
      sms_2 = sms2Errors.join(", ");
    }
    store.customerErrors.sms_2 = sms_2;
  }

  let email_1 = "";
  if (event.target.name === "email_1") {
    if (event.target.value) {
      let email1Errors = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(event.target.value)) {
        email1Errors.push("Некорректный формат email");
      }
      email_1 = email1Errors.join(", ");
    }
    store.customerErrors.email_1 = email_1;
  }

  let email_2 = "";
  if (event.target.name === "email_2") {
    if (event.target.value) {
      let email2Errors = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(event.target.value)) {
        email2Errors.push("Некорректный формат email");
      }
      email_2 = email2Errors.join(", ");
    }
    store.customerErrors.email_2 = email_2;
  }

  // Валидация страны для иностранных клиентов
  let foreign_country = "";
  if (event.target.name === "foreign_country") {
    if (store.customer.is_foreign) {
      let countryErrors = [];
      CheckEmptyLookup(event.target.value, countryErrors);
      foreign_country = countryErrors.join(", ");
    }
    store.customerErrors.foreign_country = foreign_country;
  }

  const canSave = true && customer_id === "" && arch_object_id === "" && service_id === ""
    && pin === "" && individual_surname === "" && individual_name === "" && full_name === "" 
    && address === "" && foreign_country === "";

  return canSave;
};