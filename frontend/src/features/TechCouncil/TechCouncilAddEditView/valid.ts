import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let decision = "";
  if (event.target.name === "decision") {
    let decisionErrors = [];

    decision = decisionErrors.join(", ");
    store.errordecision = decision;
  }

  const canSave = true && decision === "";

  return canSave;
};
