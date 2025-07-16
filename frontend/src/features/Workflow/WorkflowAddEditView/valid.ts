import {
  CheckDateFinish,
  CheckDateStart, CheckDateStartAfterEnd,
  CheckEmptyTextField
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

  let date_start = "";
  if (event.target.name === "date_start") {
    let date_startErrors = [];
    if (store.date_end) {
      CheckDateStartAfterEnd(event.target.value, store.date_end, date_startErrors)
    }
    date_start = date_startErrors.join(", ");
    store.errordate_start = date_start;
  }

  let date_end = "";
  if (event.target.name === "date_end") {
    let date_endErrors = [];
    if(store.date_start) {
      CheckDateFinish(event.target.value, store.date_start, date_endErrors)
    }
    date_end = date_endErrors.join(", ");
    store.errordate_end = date_end;
  }

  const canSave = true && name === "" && date_start === "" && date_end === "";

  return canSave;
};
