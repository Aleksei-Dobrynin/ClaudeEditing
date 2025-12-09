import {
  CheckEmptyNumField,
  CheckEmptyTextField, CheckIsNumber
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {


  let application_document_id = "";
  if (event.target.name === "application_document_id") {
    let application_document_idErrors = [];
    CheckEmptyNumField(event.target.value, application_document_idErrors);
    application_document_id = application_document_idErrors.join(", ");
    store.errorapplication_document_id = application_document_id;
  }
  const canSave = true && application_document_id === "";

  return canSave;
};
