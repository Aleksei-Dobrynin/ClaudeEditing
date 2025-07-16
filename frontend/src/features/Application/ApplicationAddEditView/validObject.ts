import {
  CheckEmptyLookup,
  CheckEmptyTextField
} from "components/ValidationHelper";
import store from "./storeObject";

export const validate = (event: { target: { name: string; value: any } }, i) => {
  let address = "";
  if (event.target.name === "address") {
    let addressErrors = [];
    CheckEmptyTextField(event.target.value, addressErrors);
    address = addressErrors.join(", ");
    store.arch_objects[i].erroraddress = address;
  }

  let district_id = "";
  if (event.target.name === "district_id") {
    let district_idErrors = [];
    CheckEmptyLookup(event.target.value, district_idErrors);
    district_id = district_idErrors.join(", ");
    store.arch_objects[i].errordistrict_id = district_id;
  }

  const canSave = true && address === "" && district_id === "";

  return canSave;
};
