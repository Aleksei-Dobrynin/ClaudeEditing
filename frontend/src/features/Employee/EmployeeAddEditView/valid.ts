import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let last_name = "";
  if (event.target.name === "last_name") {
    let last_nameErrors = [];
    CheckEmptyTextField(event.target.value, last_nameErrors);
    last_name = last_nameErrors.join(", ");
    store.errorlast_name = last_name;
  }

  let first_name = "";
  if (event.target.name === "first_name") {
    let first_nameErrors = [];

    first_name = first_nameErrors.join(", ");
    store.errorfirst_name = first_name;
  }

  let second_name = "";
  if (event.target.name === "second_name") {
    let second_nameErrors = [];

    second_name = second_nameErrors.join(", ");
    store.errorsecond_name = second_name;
  }

  const canSave = true && last_name === "" && first_name === "" && second_name === "";

  return canSave;
};
