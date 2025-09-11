import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getAllSignByUser, getSignEmployeeListByFile } from "api/SignDocuments";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  signers = [];
  dialogOpen = false;

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

  loadSignDocumentss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getAllSignByUser();
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

  loadSigners = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSignEmployeeListByFile(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.signers = response.data;
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
    });
  };
}

export default new NewStore();
