import { CheckEmptyTextField, CheckEmptyLookup } from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let employee_id = "";
  if (event.target.name === "employee_id") {
    let employee_idErrors = [];
    CheckEmptyLookup(event.target.value, employee_idErrors);
    employee_id = employee_idErrors.join(", ");
    store.erroremployee_id = employee_id;
  }
  let post_id = "";
  if (event.target.name === "post_id") {
    let post_idErrors = [];
    CheckEmptyLookup(event.target.value, post_idErrors);
    post_id = post_idErrors.join(", ");
    store.errorpost_id = post_id;
  }
  let date_start = "";
  if (event.target.name === "date_start") {
    let date_startErrors = [];
    CheckEmptyTextField(event.target.value, date_startErrors);
    date_start = date_startErrors.join(", ");
    store.errordate_start = date_start;
  }

  const canSave = true && employee_id === "" && post_id === "" && date_start === "";
  return canSave;
};
