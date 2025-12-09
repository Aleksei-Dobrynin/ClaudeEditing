import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let pin_customer = "";
  if (event.target.name === "pin_customer") {
    let pin_customerErrors = [];
    CheckEmptyTextField(event.target.value, pin_customerErrors);
    pin_customer = pin_customerErrors.join(", ");
    store.errorpin_customer = pin_customer;
  }

  let description = "";
  if (event.target.name === "description") {
    let descriptionErrors = [];

    description = descriptionErrors.join(", ");
    store.errordescription = description;
  }

  const canSave = true && pin_customer === "" && description === "";

  return canSave;
};
