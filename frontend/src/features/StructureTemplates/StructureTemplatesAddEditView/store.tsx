import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getStructureTemplates } from "api/StructureTemplates";
import { createStructureTemplates } from "api/StructureTemplates";
import { updateStructureTemplates } from "api/StructureTemplates";

// dictionaries

import { getCustomSvgIcons } from "api/CustomSvgIcon";

import { getS_DocumentTemplateTypes } from "api/S_DocumentTemplateType";
import { getMyOrgStructures } from "../../../api/org_structure";

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
  first_user_structure_id = 0;
  structure_id = 0;
  template_id = 0;


  errors: { [key: string]: string } = {};

  // Справочники
  CustomSvgIcons = []
  StructureTemplatesTypes = []
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
      this.first_user_structure_id = 0;
      this.structure_id = 0;
      this.template_id = 0;

      this.errors = {}
    });
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
      idDocumentType: this.idDocumentType - 0,
      structure_id: this.first_user_structure_id - 0,
      template_id: this.template_id - 0,
      translations: this.Translates,
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
        response = await createStructureTemplates(data);
      } else {
        response = await updateStructureTemplates(data);
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
    await this.loadStructureTemplatesTypes();
    await this.loadUserOrgStructure();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadStructureTemplates(id);
  }

  loadStructureTemplates = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructureTemplates(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.idDocumentType = response.data.idDocumentType;
          this.structure_id = response.data.structure_id;
          this.template_id = response.data.template_id;
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

  loadStructureTemplatesTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplateTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.StructureTemplatesTypes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadUserOrgStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyOrgStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.first_user_structure_id = response.data[0]?.id;
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
