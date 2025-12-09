import { CheckEmptyTextField, CheckEmptyLookup } from "components/ValidationHelper";
import store from "./store";
import i18n from 'i18next';


export const validate = async (event: { target: { name: string; value: any } }) => {
  let pin = "";
  if (event.target.name === "pin") {
    let pinErrors = [];
    CheckEmptyTextField(event.target.value, pinErrors);
    pin = pinErrors.join(", ");
    store.errorpin = pin;
  }

  let full_name = "";
  if (event.target.name === "full_name") {
    let full_nameErrors = [];

    full_name = full_nameErrors.join(", ");
    store.errorfull_name = full_name;
  }
  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];

    address = addressErrors.join(", ");
    store.erroraddress = address;
  }
  let director = "";
  if (event.target.name === "director") {
    let directorErrors = [];

    director = directorErrors.join(", ");
    store.errordirector = director;
  }
  let okpo = "";
  if (event.target.name === "okpo") {
    let okpoErrors = [];

    okpo = okpoErrors.join(", ");
    store.errorokpo = okpo;
  }
  let organization_type_id = "";
  if (event.target.name === "organization_type_id") {
    // let organization_type_idErrors = [];
    // CheckEmptyLookup(event.target.value, organization_type_idErrors);

    // organization_type_id = organization_type_idErrors.join(", ");
    // store.errororganization_type_id = organization_type_id;
  }

  let pinCheckDuplicate = "";
  if (event.target.name === "pinCheckDuplicate") {
    let pinCheckDuplicateErrors = [];
    // let checkDuplicate = await store.searchByPin(event.target.value);
    // if (!checkDuplicate) {
    //   (() => pinCheckDuplicateErrors.push(i18n.t("message:error.ExistPin")))()
    // }
    pinCheckDuplicate = pinCheckDuplicateErrors.join(", ");

    store.errorpin = pinCheckDuplicate;
  }

  const canSave =
    true &&
    pin === "" &&
    full_name === "" &&
    address === "" &&
    director === "" &&
    okpo === "" &&
    organization_type_id === "" &&
    pinCheckDuplicate === "";
  console.log(canSave)
  return canSave;
};
