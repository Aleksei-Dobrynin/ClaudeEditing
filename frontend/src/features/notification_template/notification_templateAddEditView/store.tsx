import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getnotification_template } from "api/notification_template";
import { createnotification_template } from "api/notification_template";
import { updatenotification_template } from "api/notification_template";

// dictionaries

import { getcontact_types } from "api/contact_type";


class NewStore {
  id = 0
  contact_type_id = 0
  code = ""
  subject = ""
  body = ""
  placeholders = ""
  link = ""


  errors: { [key: string]: string } = {};

  // Справочники
  contact_types = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.contact_type_id = 0
      this.code = ""
      this.subject = ""
      this.body = ""
      this.placeholders = ""
      this.link = ""

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
      contact_type_id: this.contact_type_id - 0 === 0 ? null : this.contact_type_id - 0,
      code: this.code,
      subject: this.subject,
      body: this.body,
      placeholders: this.placeholders,
      link: this.link,
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
        response = await createnotification_template(data);
      } else {
        response = await updatenotification_template(data);
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
    await this.loadcontact_types();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadnotification_template(id);
  }

  loadnotification_template = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getnotification_template(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.contact_type_id = response.data.contact_type_id;
          this.code = response.data.code;
          this.subject = response.data.subject;
          this.body = response.data.body;
          this.placeholders = response.data.placeholders;
          this.link = response.data.link;
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
