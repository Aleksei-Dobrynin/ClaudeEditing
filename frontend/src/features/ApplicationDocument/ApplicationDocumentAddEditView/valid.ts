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

  let document_type_id = "";
  if (event.target.name === "document_type_id") {
    let document_type_idErrors = [];

    document_type_id = document_type_idErrors.join(", ");
    store.errordocument_type_id = document_type_id;
  }

  let law_description = "";
  if (event.target.name === "law_description") {
    let law_descriptionErrors = [];

    law_description = law_descriptionErrors.join(", ");
    store.errorlaw_description = law_description;
  }

  const canSave = true && name === "" && description === "" && document_type_id === "" && law_description === "";

  return canSave;
};
