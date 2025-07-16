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

  let FileName = "";
  if (event.target.name === "FileName") {
    let FileNameErrors = [];
    CheckEmptyTextField(event.target.value, FileNameErrors);
    FileName = FileNameErrors.join(", ");
    store.errorFileName = FileName;
  }

  const canSave = true && name === "" && FileName === "";

  return canSave;
};
