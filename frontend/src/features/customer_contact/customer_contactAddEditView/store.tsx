import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getcustomer_contact } from "api/customer_contact";
import { createcustomer_contact } from "api/customer_contact";
import { updatecustomer_contact } from "api/customer_contact";

// dictionaries

import { getCustomers } from "api/Customer/useGetCustomers";

import { getcontact_types } from "api/contact_type";


class NewStore {
  id = 0
  value = ""
  type_id = 0
  customer_id = 0
  allow_notification = false


  errors: { [key: string]: string } = {};

  // Справочники
  customers = []
  contact_types = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.value = ""
      this.type_id = 0
      this.customer_id = 0
      this.allow_notification = false

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      value: this.value,
      type_id: this.type_id - 0,
      customer_id: this.customer_id - 0,
      allow_notification: this.allow_notification,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createcustomer_contact(data);
      } else {
        response = await updatecustomer_contact(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
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
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadcustomers();
    await this.loadcontact_types();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadcustomer_contact(id);
  }

  loadcustomer_contact = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getcustomer_contact(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.value = response.data.value;
          this.type_id = response.data.type_id;
          this.customer_id = response.data.customer_id;
          this.allow_notification = response.data.allow_notification;
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


  loadcustomers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomers();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.customers = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadcontact_types = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontact_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.contact_types = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


}

export default new NewStore();
