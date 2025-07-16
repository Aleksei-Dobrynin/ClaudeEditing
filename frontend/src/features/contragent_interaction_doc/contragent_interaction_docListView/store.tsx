import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletecontragent_interaction_doc } from "api/contragent_interaction_doc";
import { getcontragent_interaction_docsByinteraction_id } from "api/contragent_interaction_doc";
import { downloadFile } from "api/File";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  timeoutId = null;


  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    this.openPanel = true;
    this.currentId = id;
  }

  closePanel() {
    this.openPanel = false;
    this.currentId = 0;
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  };

  async loadcontragent_interaction_docs() {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interaction_docsByinteraction_id(this.idMain);
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

  async loadcontragent_interaction_docsByinteraction_id(id: number, interval = 5000) {
    const poll = async () => {
      try {
        // MainStore.changeLoader(true);
        const response = await getcontragent_interaction_docsByinteraction_id(id);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.data = response.data;
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        // MainStore.changeLoader(false);
      }
      this.timeoutId = setTimeout(poll, interval);
    };

    this.clearPollingTimeout();
    poll();
  };

  clearPollingTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.data.contentType || "application/octet-stream" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.data.fileDownloadName || fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  deletecontragent_interaction_doc(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletecontragent_interaction_doc(id);
          if (response.status === 201 || response.status === 200) {
            this.loadcontragent_interaction_docs();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
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

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
