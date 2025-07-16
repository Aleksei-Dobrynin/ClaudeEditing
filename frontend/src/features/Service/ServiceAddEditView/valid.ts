import {
  CheckEmptyTextField, CheckIsNumber
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

  let code = "";
  if (event.target.name === "code") {
    let codeErrors = [];

    code = codeErrors.join(", ");
    store.errorcode = code;
  }

  let day_count = "";
  if (event.target.name === "day_count") {
    let day_countErrors = [];
    CheckIsNumber(event.target.value, day_countErrors);
    day_count = day_countErrors.join(", ");
    store.errorday_count = day_count;
  }
  let price = "";
  if (event.target.name === "price") {
    let priceErrors = [];
    CheckIsNumber(event.target.value, priceErrors);
    price = priceErrors.join(", ");
    store.errorprice = price;
  }


  const canSave = true && name === "" && description === "" && code === "" && day_count === "" && price === "";

  return canSave;
};
