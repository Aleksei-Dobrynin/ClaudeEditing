import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let sum = "";
  if (event.target.name === "sum") {
    let sumErrors = [];

    sum = sumErrors.join(", ");
    store.errorsum = sum;
  }

  const canSave = true && sum === "";

  return canSave;
};
