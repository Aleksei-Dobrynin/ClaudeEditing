import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getmyorg_structure_templates } from "api/org_structure_templates";
import { getFilledTemplate } from "api/org_structure";
import printJS from "print-js";

class NewStore {
  data = [];
  openPanel = false;
  application_id = 0;
  isEdit = false;


  constructor() {
    makeAutoObservable(this);
  }

  onPrintClick(application_id: number) {
    this.application_id = application_id;
    this.openPanel = true;
    this.loadorg_structure_template()
  }

  closePanel() {
    this.openPanel = false;
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

  async loadorg_structure_template() {
    try {
      MainStore.changeLoader(true);
      const response = await getmyorg_structure_templates();
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

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.openPanel = false;
      this.application_id = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
