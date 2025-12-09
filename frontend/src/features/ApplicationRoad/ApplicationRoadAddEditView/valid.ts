import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";
import  storeListView from "../ApplicationRoadListView/store";
import { toJS } from "mobx";

export const validate = (event: { target: { name: string; value: any } }) => {

  let description = "";
  if (event.target.name === "description") {
    let descriptionErrors = [];

    description = descriptionErrors.join(", ");
    store.errordescription = description;
  }

  let from_status_id = "";
  if (event.target.name === "from_status_id") {
    let from_status_idErrors = [];

    if (Number(event.target.value) === Number(store.to_status_id)) {
      from_status_idErrors.push("the initial status and the final status should not be the same")
    }
    from_status_id = from_status_idErrors.join(", ");
    store.from_status_idError = from_status_id;
  }

  let to_status_id = "";
  if (event.target.name === "to_status_id") {
    let to_status_idErrors = [];
    if (Number(event.target.value) === Number(store.from_status_id)) {
      to_status_idErrors.push("the initial status and the final status should not be the same")
    }
    to_status_id = to_status_idErrors.join(", ");
    store.to_status_idError = to_status_id;
  }

  const canSave = true && description === "" && from_status_id === "" && to_status_id === "";
  return canSave;
};
