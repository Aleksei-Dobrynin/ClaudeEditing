import { CheckEmptyTextField, CheckEmptyLookup } from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let date_start = "";
  if (event.target.name === "date_start") {
    let date_startErrors = [];
    CheckEmptyTextField(event.target.value, date_startErrors);
    date_start = date_startErrors.join(", ");
    store.errordate_start = date_start;
  }
  let post_id = "";
  if (event.target.name === "post_id") {
    let post_idErrors = [];
    CheckEmptyLookup(event.target.value, post_idErrors);
    post_id = post_idErrors.join(", ");
    store.errorpost_id = post_id;
  }
  let structure_id = "";
  if (event.target.name === "structure_id") {
    let structure_idErrors = [];
    CheckEmptyLookup(event.target.value, structure_idErrors);
    structure_id = structure_idErrors.join(", ");
    store.errorstructure_id = structure_id;
  }

  const canSave = true && date_start === "" && post_id === "" && structure_id === "";

  return canSave;
};
