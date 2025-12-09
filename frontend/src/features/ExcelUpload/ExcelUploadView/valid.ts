import {
  CheckEmptyTextField, CheckEmptyFileField, CheckEmptyLookup
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  
  let FileName = '';
  if (event.target.name === 'FileName') {
    let FileNameErrors = [];
    CheckEmptyFileField(event.target.value, FileNameErrors);
    FileName = FileNameErrors.join(', ');
    store.errorFileName = FileName;
  }

  const canSave = true && FileName === "";

  return canSave;
};
