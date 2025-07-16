import {
  CheckEmptyTextField, CheckIsNumber
} from "components/ValidationHelper";
import store from "./store";

export const validate = (event: { target: { name: string; value: any } }) => {
  let price = "";
  if (event.target.name === "price") {
    let priceErrors = [];
    CheckIsNumber(event.target.value, priceErrors);
    price = priceErrors.join(", ");
    store.errorprice = price;
  }


  const canSave = true && price === "";

  return canSave;
};
