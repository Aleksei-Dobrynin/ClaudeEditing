import {
    CheckEmptyTextField
} from "components/ValidationHelper";
import store from "./representativeStore";

export const validate = (event: { target: { name: string; value: any } }) => {
    let last_name = "";
    if (event.target.name === "last_name") {
        let last_nameErrors = [];
        CheckEmptyTextField(event.target.value, last_nameErrors);
        last_name = last_nameErrors.join(", ");
        store.errors.last_name = last_name;
    }

    let first_name = "";
    if (event.target.name === "first_name") {
        let first_nameErrors = [];
        CheckEmptyTextField(event.target.value, first_nameErrors);
        first_name = first_nameErrors.join(", ");
        store.errors.first_name = first_name;
    }

    let pin = "";
    if (event.target.name === "pin") {
        let pinErrors = [];
        CheckEmptyTextField(event.target.value, pinErrors);

        // Проверка формата ПИН (14 цифр)
        const pinValue = event.target.value;
        const pinRegex = /^[0-9]{14}$/;
        if (pinValue && !pinRegex.test(pinValue)) {
            pinErrors.push("ПИН должен содержать только цифры и быть длиной 14 символов.");
        }

        pin = pinErrors.join(", ");
        store.errors.pin = pin;
    }

    const canSave =
        last_name === "" &&
        first_name === "" &&
        pin === "";

    return canSave;
};