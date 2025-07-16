import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getnotification } from "api/notification";
import { createnotification } from "api/notification";
import { updatenotification } from "api/notification";

// dictionaries


class NewStore {
  id = 0
  title = ""
  text = ""
  employee_id = 0
  user_id = 0
  has_read = false
  created_at = null
  code = ""
  link = ""


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.title = ""
      this.text = ""
      this.employee_id = 0
      this.user_id = 0
      this.has_read = false
      this.created_at = null
      this.code = ""
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
      title: this.title,
      text: this.text,
      employee_id: this.employee_id - 0,
      user_id: this.user_id - 0,
      has_read: this.has_read,
      created_at: this.created_at,
      code: this.code,
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
        response = await createnotification(data);
      } else {
        response = await updatenotification(data);
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


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadnotification(id);
  }

  loadnotification = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getnotification(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.title = response.data.title;
          this.text = response.data.text;
          this.employee_id = response.data.employee_id;
          this.user_id = response.data.user_id;
          this.has_read = response.data.has_read;
          this.created_at = dayjs(response.data.created_at);
          this.code = response.data.code;
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



}

export default new NewStore();
