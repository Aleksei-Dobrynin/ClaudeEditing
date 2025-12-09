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

  let tag_id = "";
  if (event.target.name === "tag_id") {
    let tag_idErrors = [];
    CheckEmptyLookup(event.target.value, tag_idErrors);
    tag_id = tag_idErrors.join(", ");
    store.errortag_id = tag_id;
  }


  const canSave = true
    && project_id === ""
    && tag_id === ""
    ;

  return canSave;
};
