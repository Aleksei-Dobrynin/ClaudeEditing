import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getemployee_contact } from "api/employee_contact";
import { createemployee_contact } from "api/employee_contact";
import { updateemployee_contact } from "api/employee_contact";

// dictionaries
import { getcontact_types } from "api/contact_type";

import storeList from "../employee_contactListView/store"


class NewStore {
  id = 0
  value = ""
  employee_id = 0
  type_id = 0
  allow_notification = false


  errors: { [key: string]: string } = {};

  // Справочники
  contact_types = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.value = ""
      this.employee_id = 0
      this.type_id = 0
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
      employee_id: storeList.idMain,
      type_id: this.type_id - 0,
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
        response = await createemployee_contact(data);
      } else {
        response = await updateemployee_contact(data);
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
    await this.loadContactTypes();
    this.id = id;

    if (id === null || id === 0) {
      return;
    }

    this.loademployee_contact(id);
  }

  loadContactTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontact_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.contact_types = response.data.filter(x => x.code !="telegram")
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loademployee_contact = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getemployee_contact(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.value = response.data.value;
          this.employee_id = response.data.employee_id;
          this.type_id = response.data.type_id;
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



}

export default new NewStore();
