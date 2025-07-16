import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getTechCouncilSessions,
  deleteTechCouncilSession,
  getTechCouncilArchiveSessions,
  getTechCouncilSession
} from "api/TechCouncilSession";
import dayjs from "dayjs";

class NewStore {
  data = [];
  openPanel = false;
  openDocumentView = false;
  currentId = 0;
  document = '';

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

  onCloseDocument() {
    runInAction(() => {
      this.openDocumentView = false
      this.document = '';
    });
  }

  loadTechCouncilSessions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilSessions();
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

  loadTechCouncilArchiveSessions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilArchiveSessions();
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

  loadTechCouncilSession = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilSession(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.document = response.data.document;
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

  deleteTechCouncilSession = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTechCouncilSession(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTechCouncilSessions();
            MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
          } else {
            throw new Error();
          }
        } catch (err) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
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