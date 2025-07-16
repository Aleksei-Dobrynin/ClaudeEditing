import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let name = "";
  if (event.target.name === "name") {
    let nameErrors = [];
    // CheckEmptyTextField(event.target.value, nameErrors);
    name = nameErrors.join(", ");
    store.errorname = name;
  }
  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];
    // CheckEmptyTextField(event.target.value, nameErrors);
    address = addressErrors.join(", ");
    store.erroraddress = address;
  }

  let description = "";
  if (event.target.name === "description") {
    let descriptionErrors = [];

    description = descriptionErrors.join(", ");
    store.errordescription = description;
  }

  const canSave = true && name === "" && description === "";

  return canSave;
};
