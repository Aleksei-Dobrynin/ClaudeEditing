import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { adduploaded_application_document, copyUploadedDocument, getAttachedOldDocuments, getOldUploads } from "api/uploaded_application_document";
import { getuploaded_application_documentsBy } from "api/uploaded_application_document";
import { downloadFile } from "api/File";

class NewStore {
  data = [];
  dataOldDocuments = [];
  fileType = '';
  fileUrl = null;
  isOpenFileView = false;

  constructor() {
    makeAutoObservable(this);
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
        const mimeType = response.data.contentType || 'application/octet-stream';
        const fileNameBack = response.data.fileDownloadName;
        let url = ""

        if (fileNameBack.endsWith('.jpg') || fileNameBack.endsWith('.jpeg') || fileNameBack.endsWith('.png')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        } else if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        } else {
          const blob = new Blob([byteArray], { type: mimeType });
          url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', response.data.fileDownloadName || fileName);
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

  async onPickedFile(fileId: number, appId: number, serviceDocId: number, onSaved: (id) => void) {
    var data = {
      id: 0,
      file_id: fileId,
      application_document_id: appId,
      name: "",
      service_document_id: serviceDocId,
      created_at: null,
      updated_at: null,
      created_by: 0,
      updated_by: 0,
      document_number: ""
    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await adduploaded_application_document(data);
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id);
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
  }

  async loaduploaded_application_documents(idApplicationDocument: number, idApplication: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getAttachedOldDocuments(idApplicationDocument, idApplication);
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

  async loadOldUploads(idApplication: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getOldUploads(idApplication);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dataOldDocuments = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  
  async copyUploadedDocument(idApplication: number, fileId: number, serviceDocumentId: number, uploadedId: number, onSaved: (id: number) => void) {
    try {
      MainStore.changeLoader(true);
      const response = await copyUploadedDocument(serviceDocumentId, idApplication, fileId, uploadedId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.dataOldDocuments = response.data;
        onSaved(response.data.id);
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
    });
  };
}

export default new NewStore();
