import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { createnewuploaded_application_document, getuploaded_application_document } from "api/uploaded_application_document";
import { createuploaded_application_document } from "api/uploaded_application_document";
import { updateuploaded_application_document } from "api/uploaded_application_document";
import { getApplicationDocuments } from "api/ApplicationDocument/useGetApplicationDocuments";
// dictionaries




class NewStore {
  id = 0
  is_outcome = false
  document_number = ""
  file_id = 0
  application_document_id = 0
  name = ""
  service_document_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  files = []
  applications = []
  service_documents = []
  AppDocuments = []
  app_doc_ids: number[]
  selectedDocs = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.is_outcome = false
      this.document_number = ""
      this.file_id = 0
      this.application_document_id = 0
      this.name = ""
      this.service_document_id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.app_doc_ids = []
      this.selectedDocs = []
      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  changeAppDocName(ids: number[] ) {
    this.errors.name = ''
    this.app_doc_ids = ids;
    this.selectedDocs = ids
      .map(id => this.AppDocuments.find(doc => doc.id === id)?.name)
      .filter(Boolean);

    // this.validateField("name", this.name);

  }

  
  async validateField(name: string, value: any) {
      if (this.app_doc_ids.length > 0) {
        this.errors[name] = "";
        return;
      }


    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      is_outcome: this.is_outcome,
      document_number: this.document_number,
      file_id: this.file_id - 0 === 0 ? null : this.file_id - 0,
      application_document_id: this.application_document_id - 0 === 0 ? null : this.application_document_id - 0,
      name: this.name,
      service_document_id: this.service_document_id - 0 === 0 ? null : this.service_document_id - 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      app_docs: this.selectedDocs
    };

    
    if (this.app_doc_ids.length > 0 && this.errors.name) {
      const { isValid, errors } = await validate(data);
      delete errors.name;
      if (!isValid) {
        this.errors = errors;
        MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
        return;
      }
    }
    

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createnewuploaded_application_document(data);
      } else {
        response = await updateuploaded_application_document(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
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

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loaduploaded_application_document(id);
    this.loadApplicationDocuments();
  }

  loaduploaded_application_document = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_document(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.is_outcome = response.data.is_outcome;
          this.document_number = response.data.document_number;
          this.file_id = response.data.file_id;
          this.application_document_id = response.data.application_document_id;
          this.name = response.data.name;
          this.service_document_id = response.data.service_document_id;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
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

  loadApplicationDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.AppDocuments = response.data;
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
