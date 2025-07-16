import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { acceptuploaded_application_document, getuploaded_application_document } from "api/uploaded_application_document";
import { createuploaded_application_document } from "api/uploaded_application_document";
import { updateuploaded_application_document } from "api/uploaded_application_document";

// dictionaries


class NewStore {
  id = 0
  file_id = 0
  application_document_id = 0
  name = ""
  service_document_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  document_number = ""

  fileName = "";
  File = null;
  idDocumentinputKey = "";


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0
      this.fileName = ""
      this.File = null
      this.idDocumentinputKey = Math.random().toString(36);
      this.application_document_id = 0
      this.name = ""
      this.service_document_id = 0
      this.created_at = ""
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0
      this.document_number = ""

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  async acceptDocumentWithoutFile(onSaved: (id: number) => void) {
    var data = {
      id: this.id - 0,
      file_id: this.file_id - 0,
      application_document_id: this.application_document_id - 0,
      name: this.name,
      service_document_id: this.service_document_id - 0,
      created_at: this.created_at === "" ? null : this.created_at,
      updated_at: this.updated_at === "" ? null : this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      fileName: this.fileName,
      document_number: this.document_number
    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await acceptuploaded_application_document(data);
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

  async onSaveClick(onSaved: (id: number) => void, step_id: number, file: any, file_name: string, comment: string) {
    var data = {

      id: this.id - 0,
      file_id: this.file_id - 0,
      application_document_id: this.application_document_id - 0,
      name: this.name,
      service_document_id: this.service_document_id - 0 < 1 ? null : this.service_document_id - 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
      app_step_id: step_id,
      comment: comment,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      fileName: this.fileName,
      document_number: this.document_number
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response = await createuploaded_application_document(data, file_name, file);
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
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


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loaduploaded_application_document(id);
  }

  loaduploaded_application_document = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_document(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.file_id = response.data.file_id;
          this.application_document_id = response.data.application_document_id;
          this.name = response.data.name;
          this.service_document_id = response.data.service_document_id;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.document_number = response.data.document_number;
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



}

export default new NewStore();
