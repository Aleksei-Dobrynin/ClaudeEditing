import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getS_DocumentTemplate } from "api/S_DocumentTemplate";
import { createS_DocumentTemplate } from "api/S_DocumentTemplate";
import { updateS_DocumentTemplate } from "api/S_DocumentTemplate";
import { getorg_structures } from "api/org_structure";

// dictionaries

import { getCustomSvgIcons } from "api/CustomSvgIcon";

import { getS_DocumentTemplateTypes } from "api/S_DocumentTemplateType";

type LanguageCh = {
  language_id: number;
  template: string;
}

class NewStore {
  id = 0
  name = ""
  description = ""
  code = ""
  idCustomSvgIcon = 0
  iconColor = ""
  idDocumentType = 0
  OrgStructures = []
  id_OrgStructures: number[]


  errors: { [key: string]: string } = {};

  // Справочники
  CustomSvgIcons = []
  S_DocumentTemplateTypes = []
  Translates = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.name = ""
      this.description = ""
      this.code = ""
      this.idCustomSvgIcon = 0
      this.iconColor = ""
      this.idDocumentType = 0
      this.id_OrgStructures = []
      this.OrgStructures = []
      this.errors = {}
    });
  }

  changeOrgStructures(ids: number[]) {
    this.id_OrgStructures = ids;
  }

  loadOrgStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.OrgStructures = response.data
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

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }
  
  languageChanged(translates: any[]){
    this.Translates = translates
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
      name: this.name,
      description: this.description,
      code: this.code,
      idCustomSvgIcon: null,
      iconColor: this.iconColor,
      idDocumentType: this.idDocumentType - 0,
      translations: this.Translates,
      OrgStructures: this.id_OrgStructures
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
        response = await createS_DocumentTemplate(data);
      } else {
        response = await updateS_DocumentTemplate(data);
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
    // await this.loadCustomSvgIcons();
    await this.loadS_DocumentTemplateTypes();
    await this.loadOrgStructures();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadS_DocumentTemplate(id);
  }

  loadS_DocumentTemplate = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplate(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.idCustomSvgIcon = response.data.idCustomSvgIcon;
          this.iconColor = response.data.iconColor;
          this.idDocumentType = response.data.idDocumentType;
          this.id_OrgStructures = response.data.orgStructures;
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


  loadCustomSvgIcons = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomSvgIcons();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.CustomSvgIcons = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadS_DocumentTemplateTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplateTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_DocumentTemplateTypes = response.data
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
