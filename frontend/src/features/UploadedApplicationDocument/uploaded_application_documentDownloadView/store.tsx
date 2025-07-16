import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { acceptuploaded_application_document, deleteuploaded_application_document } from "api/uploaded_application_document";
import { getuploaded_application_documentsBy } from "api/uploaded_application_document";
import { downloadFile } from "api/File";

class NewStore {
  data = [];
  incomingData = [];
  outgoingData = [];
  openPanel = false;
  openPanelNew = false;
  openPanelAttachFromOtherDoc = false;
  idDocumentAttach = 0;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  service_document_id = 0;


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
    this.service_document_id = 0;
  }

  onEditNewClicked(id: number) {
    this.openPanelNew = true;
    this.currentId = id;
  }
  closeNewPanel() {
    this.openPanelNew = false;
    this.currentId = 0;
  }

  closePanelAttach() {
    this.openPanelAttachFromOtherDoc = false;
    this.idDocumentAttach = 0;
    this.currentId = 0;
  }
  attachClicked(idDocument: number) {
    this.openPanelAttachFromOtherDoc = true;
    this.idDocumentAttach = idDocument;
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
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
        } 

        const blob = new Blob([byteArray], { type: mimeType });
        url = window.URL.createObjectURL(blob);
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

  uploadFile(service_document_id: number, upload_id: number) {
    this.service_document_id = service_document_id;
    this.currentId = upload_id
    this.openPanel = true;
  }

  async loaduploaded_application_documents() {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_documentsBy(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        const out_doc = response.data.filter(el => el.is_outcome === true);
        this.outgoingData = out_doc;
        const inc_doc = response.data.filter(el => el.file_id !== null && (el.is_outcome === false || el.is_outcome === null));
        this.incomingData = inc_doc;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteuploaded_application_document(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteuploaded_application_document(id);
          if (response.status === 201 || response.status === 200) {
            this.loaduploaded_application_documents();
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

  async rejectDocument(upl_id: number) {
    try {
      MainStore.changeLoader(true);
      let response;
      response = await deleteuploaded_application_document(upl_id);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents()
        MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async acceptDocumentWithoutFile(serDoc: number) {
    var data = {
      id: 0,
      file_id: 0,
      application_document_id: this.idMain,
      name: "",
      service_document_id: serDoc,
      created_at: null,
      updated_at: null,
      created_by: 0,
      updated_by: 0,
      document_number: ""
    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await acceptuploaded_application_document(data);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents()
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.openPanelNew = false;
    });
  };
}

export default new NewStore();
