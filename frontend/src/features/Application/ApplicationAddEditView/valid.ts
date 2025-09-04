import {
  CheckEmptyLookup,
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {

  let customer_id = "";
  if (event.target.name === "customer_id") {
    let customer_idErrors = [];
    // CheckEmptyLookup(event.target.value, customer_idErrors);
    customer_id = customer_idErrors.join(", ");
    store.errorcustomer_id = customer_id;
  }

  let arch_object_id = "";
  if (event.target.name === "arch_object_id") {
    let arch_object_idErrors = [];
    // CheckEmptyLookup(event.target.value, arch_object_idErrors);
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

  let foreign_country = ""
  let pin = "";
  if (event.target.name === "pin") {
    let pinErrors = [];
    CheckEmptyTextField(event.target.value.pin, pinErrors);
    if (!event.target.value.is_foreign) {
      const pinValue = event.target.value.pin;
      const pinRegex = /^[0-9]{14}$/;
      if (!pinRegex.test(pinValue)) {
        pinErrors.push("ИНН должен содержать только цифры и быть длиной 14 символов.");
      }
    } else {
      let countryErrors = [];
      CheckEmptyLookup(event.target.value.foreign_country, countryErrors);
      foreign_country = countryErrors.join(", ");
      store.customerErrors.foreign_country = foreign_country;
    }

    pin = pinErrors.join(", ");
    store.customerErrors.pin = pin;
  }

  let individual_surname = "";
  if (event.target.name === "individual_surname") {
    let individual_surnameErrors = [];
    CheckEmptyTextField(event.target.value, individual_surnameErrors);
    individual_surname = individual_surnameErrors.join(", ");
    store.customerErrors.individual_surname = individual_surname;
  }

  let individual_name = "";
  if (event.target.name === "individual_name") {
    let individual_nameErrors = [];
    CheckEmptyTextField(event.target.value, individual_nameErrors);
    individual_name = individual_nameErrors.join(", ");
    store.customerErrors.individual_name = individual_name;
  }

  // let individual_secondname = "";
  // if (event.target.name === "individual_secondname") {
  //   let individual_secondnameErrors = [];
  //   CheckEmptyTextField(event.target.value, individual_secondnameErrors);
  //   individual_secondname = individual_secondnameErrors.join(", ");
  //   store.customerErrors.individual_secondname = individual_secondname;
  // }

  const canSave = true && customer_id === "" && arch_object_id === "" && service_id === ""
    && pin === "" && individual_surname === "" && individual_name === "";

  return canSave;
};
