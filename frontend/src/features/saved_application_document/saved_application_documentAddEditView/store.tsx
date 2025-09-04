import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getsaved_application_document, createDoc } from "api/saved_application_document";
import { createsaved_application_document } from "api/saved_application_document";
import { updatesaved_application_document } from "api/saved_application_document";

// dictionaries

import { getS_DocumentTemplates } from "api/S_DocumentTemplate";

import { getLanguages } from "api/Language";
import { saved_application_document } from "constants/saved_application_document";
import printJS from "print-js";
import indexStore from './../saved_application_documentListView/store'
import { downloadFile } from "api/File";

class NewStore {
  id = 0
  file_id = 0
  application_id = 0
  template_id = 0
  language_id = 0
  body = ""
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  updated_by_name = ""
  code = "";


  errors: { [key: string]: string } = {};

  // Справочники
  applications = []
  S_DocumentTemplates = []
  Languages = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.application_id = 0
      this.file_id = 0
      this.template_id = 0
      this.language_id = 0
      this.body = ""
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.code = "";

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
    indexStore.onDocumentChanged(true)
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  printHtml() {
    this.onSaveClick(() => {
      printJS({
        printable: this.body,
        type: 'raw-html',
        targetStyles: ['*']
      });
      MainStore.onCloseConfirm()
    })

    if (indexStore.documentChanged) {
      // MainStore.openErrorConfirm(i18n.t("label:saved_application_documentAddEditView.doYouWantSave"), i18n.t("yes"), i18n.t("no"), () => {

      // }, () => {
      //   printJS({
      //     printable: this.body,
      //     type: 'raw-html',
      //     targetStyles: ['*']
      //   });
      //   MainStore.onCloseConfirm()
      // })
    }
    // else {
    //   printJS({
    //     printable: this.body,
    //     type: 'raw-html',
    //     targetStyles: ['*']
    //   });
    // }
  }


 

  signApplicationPayment = async () => {
    try {
      MainStore.changeLoader(true);
      let response = await createDoc(this.application_id - 0, this.template_id - 0, this.language_id - 0, this.body);

      if (response.status === 201 || response.status === 200) {

        this.file_id = response.data;
        MainStore.openDigitalSign(
          response.data,
          async () => {
            MainStore.onCloseDigitalSign();

            indexStore.OpenFileFile(response.data, "doc.pdf")
            // await this.downloadFileView(response.data, "");
            indexStore.onDocumentChanged(false);
            indexStore.loadS_DocumentTemplates();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          },
          () => MainStore.onCloseDigitalSign(),
        );


      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }



  };

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: 0,
      application_id: this.application_id - 0,
      template_id: this.template_id - 0,
      language_id: this.language_id - 0,
      body: this.body,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      console.log(this.errors)
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      response = await createsaved_application_document(data);
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.file_id);
        indexStore.onDocumentChanged(false)
        indexStore.loadS_DocumentTemplates()
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
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadS_DocumentTemplates();
    await this.loadLanguages();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadsaved_application_document(id);
  }

  setData(data: saved_application_document) {
    this.id = data.id;
    this.application_id = data.application_id;
    this.file_id = data.file_id;
    this.template_id = data.template_id;
    this.language_id = data.language_id;
    this.body = data.body;
    this.created_at = dayjs(data.created_at);
    this.updated_at = dayjs(data.updated_at);
    this.created_by = data.created_by;
    this.updated_by = data.updated_by;
    this.updated_by_name = data.updated_by_name;
    this.code = data.code;

    console.log(this.code);
  }

  loadsaved_application_document = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getsaved_application_document(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
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


  loadS_DocumentTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
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

  loadLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Languages = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


}

export default new NewStore();
