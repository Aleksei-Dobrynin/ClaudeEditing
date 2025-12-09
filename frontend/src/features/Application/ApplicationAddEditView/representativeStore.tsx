import { makeAutoObservable } from "mobx";
import dayjs from "dayjs";
import { CustomerRepresentative } from "constants/CustomerRepresentative";
import customerStore from './store'
import { validate } from "./validRepresentative";
import i18n from "i18next";
import MainStore from "MainStore";

class NewStore {
  representativeOnEdit: CustomerRepresentative = {
    id: 0,
    customer_id: 0,
    last_name: "",
    first_name: "",
    pin: "",
    second_name: "",
    date_start: null,
    date_end: null,
    date_document: null,
    notary_number: "",
    requisites: "",
    is_included_to_agreement: false,
    contact: "",
  }
  isEdit = false;

  errors: { [key: string]: string } = {};


  constructor() {
    makeAutoObservable(this);
  }

  handleChangeRepresentative(event) {
    this.representativeOnEdit[event.target.name] = event.target.value;
    validate(event);
  }

  clearRepresentative = () => {
    this.representativeOnEdit = {
      id: 0,
      customer_id: 0,
      last_name: "",
      first_name: "",
      pin: "",
      second_name: "",
      date_start: null,
      date_end: null,
      date_document: null,
      notary_number: "",
      requisites: "",
      is_included_to_agreement: false,
      contact: ""
    }
  }

  clearStore = () => {
    this.clearRepresentative()
    this.isEdit = false;
    this.errors = {}
  }

  addNewClicked = (id: number) => {
    this.representativeOnEdit.id = id;
    this.isEdit = true;
  }

  setEdit = (value: CustomerRepresentative) => {
    this.isEdit = true;
    value.date_start = dayjs(value.date_start)
    value.date_end = dayjs(value.date_end)
    value.date_document = dayjs(value.date_document)
    this.representativeOnEdit = value
  }

  validateRepresentativeForm = () => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "last_name", value: this.representativeOnEdit.last_name },
    };
    canSave = validate(event) && canSave;

    event = { target: { name: "first_name", value: this.representativeOnEdit.first_name } };
    canSave = validate(event) && canSave;

    event = { target: { name: "pin", value: this.representativeOnEdit.pin } };
    canSave = validate(event) && canSave;

    return canSave;
  }

  onSaveClicked = () => {
    const canSave = this.validateRepresentativeForm();

    if (canSave) {
      customerStore.addedNewRepresentative(this.representativeOnEdit);
      this.clearRepresentative();
      this.isEdit = false;
      this.errors = {};
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  }

  onCancelClick = () => {
    this.clearRepresentative();
    this.isEdit = false;
    this.errors = {};
  }

}

export default new NewStore();