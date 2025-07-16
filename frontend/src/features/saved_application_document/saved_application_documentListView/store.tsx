import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletesaved_application_document, getSavedDocumentByApplication } from "api/saved_application_document";
import { getsaved_application_documents } from "api/saved_application_document";
import {
  getS_DocumentTemplates,
  getS_DocumentTemplatesByApplicationType,
  getS_DocumentTemplatesByApplicationTypeAndID
} from "api/S_DocumentTemplate";
import { getLanguages } from "api/Language";
import BaseStore from './../saved_application_documentAddEditView/store'
import { downloadFile, getSignByFileId } from "api/File";
import { saved_application_document } from "constants/saved_application_document";

class NewStore {
  data: saved_application_document = null;
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  application_id = 0;
  template_id = 0;
  language_id = 0;
  fileType = "";
  isOpenFileView = false;
  fileUrl = null;

  S_DocumentTemplates = []
  Languages = []
  documentChanged = false;


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
  }



  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }

  async getDocument() {
    this.onDocumentChanged(false)
    try {
      MainStore.changeLoader(true);
      const language_code = this.Languages.find(x => x.id == this.language_id)?.code;
      const response = await getSavedDocumentByApplication(this.application_id, this.template_id, this.language_id - 0, language_code);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.S_DocumentTemplates = response.data
        BaseStore.setData(response.data)
        this.data = response.data
      } else if (response.status === 204){
        this.data = null;
        BaseStore.clearStore()
        MainStore.setSnackbar("Нет шаблона документа!", 'error')
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }


  loadS_DocumentTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplatesByApplicationTypeAndID(this.application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        response.data?.sort((a, b) => {
          const nameA = a.name?.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name?.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        
          // names must be equal
          return 0;
        });

        this.S_DocumentTemplates = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  
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

  deletesaved_application_document = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletesaved_application_document(id);
          if (response.status === 201 || response.status === 200) {
            this.loadS_DocumentTemplates();
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

  loadLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Languages = response.data
        this.language_id = this.Languages[0].id
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onDocumentChanged(flag: boolean) {
    this.documentChanged = flag
  }

  clearStore() {
    runInAction(() => {
      this.data = null;
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.template_id = 0;
      this.language_id = 0;
      this.documentChanged = false;
    });
  };
}

export default new NewStore();
