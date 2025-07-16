import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getS_DocumentTemplateTranslation } from "api/S_DocumentTemplateTranslation";
import { createS_DocumentTemplateTranslation } from "api/S_DocumentTemplateTranslation";
import { updateS_DocumentTemplateTranslation } from "api/S_DocumentTemplateTranslation";

// dictionaries

import { getLanguages } from "api/Language";

import { getS_DocumentTemplates } from "api/S_DocumentTemplate";


class NewStore {
  id = 0
  template = ""
  idDocumentTemplate = 0
  idLanguage = 0


  errors: { [key: string]: string } = {};

  // Справочники
  Languages = []
  S_DocumentTemplates = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.template = ""
      this.idDocumentTemplate = 0
      this.idLanguage = 0

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

      template: this.template,

      idDocumentTemplate: this.idDocumentTemplate - 0,

      idLanguage: this.idLanguage - 0,

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
        response = await createS_DocumentTemplateTranslation(data);
      } else {
        response = await updateS_DocumentTemplateTranslation(data);
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
    await this.loadLanguages();
    await this.loadS_DocumentTemplates();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadS_DocumentTemplateTranslation(id);
  }

  loadS_DocumentTemplateTranslation = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplateTranslation(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.template = response.data.template;
          this.idDocumentTemplate = response.data.idDocumentTemplate;
          this.idLanguage = response.data.idLanguage;
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


  loadLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Languages = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadS_DocumentTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_DocumentTemplates = response.data
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
