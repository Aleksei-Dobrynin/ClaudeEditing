import {
  CheckEmptyTextField, CheckEmptyFileField, CheckEmptyLookup
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
  
  let FileName = '';
  if (event.target.name === 'FileName') {
    let FileNameErrors = [];
    CheckEmptyFileField(event.target.value, FileNameErrors);
    FileName = FileNameErrors.join(', ');
    store.errorFileName = FileName;
  }

  
  let type_id = '';
  if (event.target.name === 'type_id') {
    let type_idErrors = [];
    CheckEmptyLookup(event.target.value, type_idErrors);
    type_id = type_idErrors.join(', ');
    store.errortype_id = type_id;
  }

  const canSave = true && name === "" && FileName === "" && type_id === "";

  return canSave;
};
