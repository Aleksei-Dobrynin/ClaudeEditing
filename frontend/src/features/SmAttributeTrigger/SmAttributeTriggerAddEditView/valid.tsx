import {
  CheckEmptyLookup,
  CheckEmptyTextField,
  CheckNullOrMore,
  CheckOnlyDigit,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {

  let project_id = "";
  if (event.target.name === "project_id") {
    let project_idErrors = [];
    CheckEmptyLookup(event.target.value, project_idErrors);
    project_id = project_idErrors.join(", ");
    store.errorproject_id = project_id;
  }

  let attribute_id = "";
  if (event.target.name === "attribute_id") {
    let attribute_idErrors = [];
    CheckEmptyLookup(event.target.value, attribute_idErrors);
    attribute_id = attribute_idErrors.join(", ");
    store.errorattribute_id = attribute_id;
  }

  let value = "";
  if (event.target.name === "value") {
    let valueErrors = [];

    value = valueErrors.join(", ");
    store.errorvalue = value;
  }


  const canSave = true
    && project_id === ""
    && attribute_id === ""
    && value === ""
    ;

  return canSave;
};
