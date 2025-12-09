import {
  CheckEmptyTextField,
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let doc_number = "";
  if (event.target.name === "doc_number") {
    let doc_numberErrors = [];
    CheckEmptyTextField(event.target.value, doc_numberErrors)
    doc_number = doc_numberErrors.join(", ");
    store.errordoc_number = doc_number;
  }

  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];

    address = addressErrors.join(", ");
    store.erroraddress = address;
  }

  const canSave = true && doc_number === "" && address === "";

  return canSave;
};
