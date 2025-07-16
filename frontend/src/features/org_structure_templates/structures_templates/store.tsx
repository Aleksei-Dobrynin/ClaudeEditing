import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getmyorg_structure_templates, getorg_structure_templateBystructure_id } from "api/org_structure_templates";
import { getFilledTemplate } from "api/org_structure";
import printJS from "print-js";
import { getLanguages } from "../../../api/Language";

class NewStore {
  data = [];
  Languages = [];
  isOpenStructureTemplates = false;
  application_id = 0;
  structure_id = 0;
  isEdit = false;
  isOpenSelectLang = false;
  current_template_id = 0;
  current_language_code = '';


  constructor() {
    makeAutoObservable(this);
  }

  closePanel() {
    this.isOpenStructureTemplates = false;
  }

  async printDocument(idDocument: number, language_code: string) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplate(idDocument, language_code, { application_id: this.application_id });
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: 'raw-html',
          targetStyles: ['*']
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

  async loadorg_structure_template(structure_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structure_templateBystructure_id(structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadLanguages(){
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Languages = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.Languages = [];
      this.isOpenStructureTemplates = false;
      this.application_id = 0;
      this.structure_id = 0;
      this.isEdit = false;
      this.isOpenSelectLang = false;
    });
  };
}

export default new NewStore();
