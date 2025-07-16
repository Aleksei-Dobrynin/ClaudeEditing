import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let name = "";
  if (event.target.name === "name") {
    let nameErrors = [];
    CheckEmptyTextField(event.target.value, nameErrors);
    name = nameErrors.join(", ");
    store.errorname = name;
  }

  let code = "";
  if (event.target.name === "code") {
    let codeErrors = [];

    code = codeErrors.join(", ");
    store.errorcode = code;
  }

  const canSave = true && name === "" && code === "";

  return canSave;
};
