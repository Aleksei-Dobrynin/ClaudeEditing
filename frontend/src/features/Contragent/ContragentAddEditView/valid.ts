import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let organization_id = "";
  if (event.target.name === "organization_id") {
    let organizationErrors = [];
    if (!event.target.value || event.target.value === 0) {
      organizationErrors.push("Выберите организацию");
    }
    organization_id = organizationErrors.join(", ");
    store.errororganization_id = organization_id;
  }

  let name = "";
  if (event.target.name === "name") {
    let nameErrors = [];
    CheckEmptyTextField(event.target.value, nameErrors);
    name = nameErrors.join(", ");
    store.errorname = name;
  }

  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];
    // address - необязательное поле
    address = addressErrors.join(", ");
    store.erroraddress = address;
  }

  let contacts = "";
  if (event.target.name === "contacts") {
    let contactsErrors = [];
    // contacts - необязательное поле
    contacts = contactsErrors.join(", ");
    store.errorcontacts = contacts;
  }

  let code = "";
  if (event.target.name === "code") {
    let codeErrors = [];
    // code заполняется автоматически, но должен быть непустым
    CheckEmptyTextField(event.target.value, codeErrors);
    code = codeErrors.join(", ");
    store.errorcode = code;
  }

  let date_start = "";
  if (event.target.name === "date_start") {
    let dateStartErrors = [];
    // date_start - обязательное поле
    if (!event.target.value) {
      dateStartErrors.push("Укажите дату начала");
    }
    date_start = dateStartErrors.join(", ");
    store.errordate_start = date_start;
  }

  let date_end = "";
  if (event.target.name === "date_end") {
    let dateEndErrors = [];
    // date_end - обязательное поле
    if (!event.target.value) {
      dateEndErrors.push("Укажите дату окончания");
    }
    date_end = dateEndErrors.join(", ");
    store.errordate_end = date_end;
  }

  const canSave = 
    organization_id === "" && 
    name === "" && 
    address === "" && 
    contacts === "" && 
    code === "" && 
    date_start === "" && 
    date_end === "";

  return canSave;
};