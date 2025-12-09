import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getArchiveObjectFiles,
  getArchiveObjectFilesByArchiveObject,
  getArchiveObjectFilesByArchiveFolder,
} from "api/ArchiveObjectFile/useGetArchiveObjectFiles";
import { deleteArchiveObjectFile } from "api/ArchiveObjectFile/useDeleteArchiveObjectFile";
import { downloadFile } from "api/File";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idArchiveObject = 0;
  idArchiveFolder = 0;
  openPanelEditTags = false;
  openPanelSendFolder = false;
  checkedFiles = [];

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

  clickCheckbox(idFile: number, value: boolean) {
    let data = this.data;
    data.forEach((element) => {
      if (element.id === idFile) {
        element.checked = value;
      }
    });
    this.data = data;
  }

  loadArchiveObjectFilesByArchiveObject = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectFilesByArchiveObject(this.idArchiveObject);
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

  loadArchiveObjectFilesByArchiveFolder = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectFilesByArchiveFolder(this.idArchiveFolder);
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

        const mimeType = response.data.contentType || "application/octet-stream";
        const fileNameBack = response.data.fileDownloadName;

        let url = "";

        if (
          fileNameBack.endsWith(".jpg") ||
          fileNameBack.endsWith(".jpeg") ||
          fileNameBack.endsWith(".png")
        ) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        } else if (fileNameBack.endsWith(".pdf")) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: "application/pdf" });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        } else {
          const blob = new Blob([byteArray], { type: mimeType });
          url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", response.data.fileDownloadName || fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  onEditTags(flag: boolean, number?: number) {
    this.openPanelEditTags = flag;
    this.currentId = number;
  }

  sendToFolder(flag: boolean) {
    this.openPanelSendFolder = flag;
  }

  clearCheckeds = () => {
    let data = this.data;
    data.forEach((x) => {
      x.checked = false;
    });
    this.data = data;
  };

  deleteArchiveObjectFile = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteArchiveObjectFile(id);
          if (response.status === 201 || response.status === 200) {
            this.loadArchiveObjectFilesByArchiveObject();
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
      this.checkedFiles = [];
    });
  };
}

export default new NewStore();
