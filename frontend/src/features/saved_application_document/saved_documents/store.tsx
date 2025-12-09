import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getsaved_application_documentsByApplication } from "api/saved_application_document";
import printJS from "print-js";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idService = 0;
  application_id = 0;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  downloadFile(body: string) {
    printJS({
      printable: body,
      type: "raw-html",
      targetStyles: ["*"],
    });
  }

  loadSavedApplicationDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getsaved_application_documentsByApplication(this.application_id);
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

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.application_id = 0;
    });
  };
}

export default new NewStore();
