import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getarchitecture_process, getGenerateNumber, sendToDutyPlan } from "api/architecture_process";
import { createarchitecture_process } from "api/architecture_process";
import { updatearchitecture_process } from "api/architecture_process";
import {sendDpOutgoingNumber} from "api/Application/useUpdateApplication"

// dictionaries

import { getarchitecture_statuses } from "api/architecture_status";
import { getuploaded_application_documentsByApplicationId } from "api/uploaded_application_document";
import { getApplicationWorkDocumentsByIDApplication } from "api/ApplicationWorkDocument/useGetApplicationWorkDocuments";
import { APPLICATION_STATUSES, DOCUMENT_TYPES } from "constants/constant";
import { PropaneSharp } from "@mui/icons-material";


class NewStore {
  id = 0
  status_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  dp_outgoing_number = ""
  application_id = 0
  uploadedDocuments = []
  uploadedDocsChecked = []
  workDocuments = []
  workDocsChecked = []



  errors: { [key: string]: string } = {};

  // Справочники
  architecture_statuses = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.status_id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.dp_outgoing_number = ""
      this.uploadedDocuments = []
      this.uploadedDocsChecked = []
      this.workDocuments = []
      this.workDocsChecked = []

      this.errors = {}
    });
  }

  setApplicationId(application_id: number) {
    this.application_id = application_id;
  }

  async getNumber(application_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getGenerateNumber(application_id);
      if ((response.status === 201 || response.status === 200)) {
        if (response.data) {
          runInAction(() => {
            this.dp_outgoing_number = response.data.number.result;
          });
        }
      }else if(response.status === 204){

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  onChangeCheckWork(id: number) {
    const index = this.workDocsChecked.indexOf(id, 0);
    if (index > -1) {
      this.workDocsChecked.splice(index, 1);
    } else {
      this.workDocsChecked = [...this.workDocsChecked, id]
    }
  }
  onChangeCheckUpl(id: number) {
    const index = this.uploadedDocsChecked.indexOf(id, 0);
    if (index > -1) {
      this.uploadedDocsChecked.splice(index, 1);
    } else {
      this.uploadedDocsChecked = [...this.uploadedDocsChecked, id]
    }
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    try {
      MainStore.changeLoader(true);
      const response1 = await sendToDutyPlan(this.id, this.dp_outgoing_number, this.workDocsChecked, this.uploadedDocsChecked);
      if (response1.status === 201 || response1.status === 200) {
        onSaved(response1);
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error("Ошибка при сохранении дежурного плана");
      }
  
      const response2 = await sendDpOutgoingNumber(this.application_id, this.dp_outgoing_number);
      if (response2.status === 201 || response2.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error("Ошибка при сохранении исходящего номера");
      }
  
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  
  async doLoad(application_id: number) {

    //загрузка справочников
    await this.loadarchitecture_statuses();


    if (application_id === null || application_id === 0) {
      return;
    }
    this.id = application_id;

    this.loadarchitecture_process(application_id);
    this.loadDocuments(application_id);
    this.loadWorkDocuments(application_id)
  }

  loadarchitecture_process = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_process(id);
      if ((response.status === 201 || response.status === 200)) {
        if (response.data) {
          runInAction(() => {
            this.id = response.data.id;
            this.status_id = response.data.status_id;
            this.created_at = dayjs(response.data.created_at);
            this.updated_at = dayjs(response.data.updated_at);
            this.created_by = response.data.created_by;
            this.updated_by = response.data.updated_by;
          });
        }
      }else if(response.status === 204){

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDocuments = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_documentsByApplicationId(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.uploadedDocuments = response.data.filter(x => x.file_id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadWorkDocuments = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocumentsByIDApplication(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.workDocuments = response.data;
        this.workDocsChecked = this.workDocuments.filter(x => x.id_type_code === DOCUMENT_TYPES.urban_dev_docs).map(x => x.id)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  loadarchitecture_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.architecture_statuses = response.data
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
