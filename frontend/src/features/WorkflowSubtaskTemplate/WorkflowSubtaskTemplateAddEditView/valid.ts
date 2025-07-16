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

  let description = "";
  if (event.target.name === "description") {
    let descriptionErrors = [];

    description = descriptionErrors.join(", ");
    store.errordescription = description;
  }

  let workflow_task_id = "";
  if (event.target.name === "workflow_task_id") {
    let workflow_task_idErrors = [];

    workflow_task_id = workflow_task_idErrors.join(", ");
    store.errorworkflow_task_id = workflow_task_id;
  }

  const canSave = true && name === "" && description === "" && workflow_task_id === "";

  return canSave;
};
