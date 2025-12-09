import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomerRepresentative } from "api/CustomerRepresentative/useGetCustomerRepresentative";
import { createCustomerRepresentative } from "api/CustomerRepresentative/useCreateCustomerRepresentative";
import { updateCustomerRepresentative } from "api/CustomerRepresentative/useUpdateCustomerRepresentative";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  customer_id = 0;
  last_name = "";
  first_name = "";
  second_name = "";
  date_start = null;
  date_end = null;
  date_document = null;
  notary_number = "";
  contact = "";
  requisites = "";
  pin = "";
  is_included_to_agreement = false;
  errorcustomer_id = "";
  errorlast_name = "";
  errorfirst_name = "";
  errorsecond_name = "";
  errordate_start = null;
  errordate_end = null;
  errordate_document = "";
  errornotary_number = "";
  errorrequisites = "";
  errorpin = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.customer_id = 0;
      this.last_name = "";
      this.first_name = "";
      this.second_name = "";
      this.date_start = null;
      this.date_end = null;
      this.date_document = null;
      this.notary_number = "";
      this.contact = "";
      this.requisites = "";
      this.pin = "";
      this.is_included_to_agreement = false;
      this.errorcustomer_id = "";
      this.errorlast_name = "";
      this.errorfirst_name = "";
      this.errorsecond_name = "";
      this.errordate_start = null;
      this.errordate_end = null;
      this.errordate_document = "";
      this.errornotary_number = "";
      this.errorrequisites = "";
      this.errorpin = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id }
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "first_name", value: this.first_name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "last_name", value: this.last_name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "second_name", value: this.second_name } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          customer_id: this.customer_id,
          last_name: this.last_name,
          first_name: this.first_name,
          second_name: this.second_name,
          date_start: this.date_start,
          date_end: this.date_end,
          date_document: this.date_document,
          notary_number: this.notary_number,
          requisites: this.requisites,
          pin: this.pin,
          is_included_to_agreement: this.is_included_to_agreement,
          contact: this.contact
        };

        const response = data.id === 0
          ? await createCustomerRepresentative(data)
          : await updateCustomerRepresentative(data);

        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
          if (data.id === 0) {
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          } else {
            MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  loadCustomerRepresentative = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerRepresentative(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.customer_id = response.data.customer_id;
          this.last_name = response.data.last_name;
          this.first_name = response.data.first_name;
          this.second_name = response.data.second_name;
          this.date_start = dayjs(response.data.date_start ?? null);
          this.date_end = dayjs(response.data.date_end ?? null);
          this.date_document = dayjs(response.data.date_document ?? null);
          this.notary_number = response.data.notary_number;
          this.contact = response.data.contact;
          this.requisites = response.data.requisites;
          this.pin = response.data.pin;
          this.is_included_to_agreement = response.data.is_included_to_agreement;
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(id: number) {
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadCustomerRepresentative(id);
  }
}

export default new NewStore();
