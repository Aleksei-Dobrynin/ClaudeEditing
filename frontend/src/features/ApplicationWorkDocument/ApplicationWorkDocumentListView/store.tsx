import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deleteApplicationWorkDocument, deactivateDocument } from "api/ApplicationWorkDocument/useDeleteApplicationWorkDocument";
import { getApplicationWorkDocumentsByIDTask, getApplicationWorkDocumentsByIDApplication } from "api/ApplicationWorkDocument/useGetApplicationWorkDocuments";
import { downloadFile } from "api/File";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idTask?: number;
  idApplication?: number;
  isEdit = false;
  isOpenTemplatePanel = false;
  openPanelDelete = false;
  deleteReason = "";
  fileType = '';
  fileUrl = null;
  isOpenFileView = false;


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

  changePanelDelete(flag: boolean, id: number) {
    this.deleteReason = ""
    this.openPanelDelete = flag
    this.currentId = id;
  }
  
  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }


  closeTemplatePanel() {
    this.isOpenTemplatePanel = false;
    this.currentId = 0;
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  checkFile(fileName: string) {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
  }

  async OpenFileFile(idFile: number, fileName) {
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
        let mimeType = 'application/pdf';
        this.fileType = 'pdf';
        if (fileName.endsWith('.png')) {
          mimeType = 'image/png';
          this.fileType = 'png';
        }
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
          this.fileType = 'jpg';
        }
        const blob = new Blob([byteArray], { type: mimeType });
        this.fileUrl = URL.createObjectURL(blob);
        this.isOpenFileView = true;
        return
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async loadApplicationWorkDocuments() {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocumentsByIDApplication(this.idApplication);
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

  async loadApplicationWorkDocumentsByTask(idTask: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocumentsByIDTask(idTask);
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
        const blob = new Blob([byteArray], { type: response.data.contentType || 'application/octet-stream' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.fileDownloadName || fileName);
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

  async deleteApplicationWorkDocument(id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await deactivateDocument(id, this.deleteReason);
      if (response.status === 201 || response.status === 200) {
        this.loadApplicationWorkDocuments();
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
        this.changePanelDelete(false, 0)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
      MainStore.onCloseConfirm();
    }
  };

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.isEdit = false;
      this.idTask = null;
      this.idApplication = null;
      this.isOpenTemplatePanel = false;
    });
  };
}

export default new NewStore();
