import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getfaq_question } from "api/faq_question";
import { createfaq_question } from "api/faq_question";
import { updatefaq_question } from "api/faq_question";

// dictionaries


class NewStore {
  id = 0
  title = ""
  answer = ""
  video = ""
  is_visible = false
  settings = ""


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.title = ""
      this.answer = ""
      this.video = ""
      this.is_visible = false
      this.settings = ""

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
      answer: this.answer,
      video: this.video,
      is_visible: this.is_visible,
      settings: this.settings,
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
        response = await createfaq_question(data);
      } else {
        response = await updatefaq_question(data);
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

    this.loadfaq_question(id);
  }

  loadfaq_question = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getfaq_question(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.title = response.data.title;
          this.answer = response.data.answer;
          this.video = response.data.video;
          this.is_visible = response.data.is_visible;
          this.settings = response.data.settings;
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
