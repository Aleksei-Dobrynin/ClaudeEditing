import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getcontragent_interaction_doc } from "api/contragent_interaction_doc";
import { createcontragent_interaction_doc } from "api/contragent_interaction_doc";
import { updatecontragent_interaction_doc } from "api/contragent_interaction_doc";

// dictionaries

import { getcontragent_interactions } from "api/contragent_interaction";

// import { getfiles } from "api/file";


class NewStore {
  id = 0;
  file_id = 0;
  interaction_id = 0;
  for_customer = false;

  message = "";
  fileName = "";
  File = null;
  idDocumentinputKey = "";

  errors: { [key: string]: string } = {};

  // Справочники
  contragent_interactions = [];
  files = [];


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.interaction_id = 0;
      this.for_customer = false;
      this.message = "";
      this.fileName = "";
      this.File = null;
      this.idDocumentinputKey = Math.random().toString(36);
      this.errors = {};
    });
  }

  setInteractionId(id : number) {
    this.interaction_id = id;
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

  async onSaveClick(onSaved: (id: number) => void) {

    let isPortal = localStorage.getItem("portal") != null;
    var data = {
      id: this.id - 0,
      file_id: this.file_id - 0,
      interaction_id: this.interaction_id - 0,
      fileName: this.fileName,
      message: this.message,
      is_portal: isPortal,
      for_customer: this.for_customer,
    };
    // const { isValid, errors } = await validate(data);
    // if (!isValid) {
    //   this.errors = errors;
    //   MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    //   return;
    // }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createcontragent_interaction_doc(data, this.fileName, this.File);
      } else {
        response = await updatecontragent_interaction_doc(data, this.fileName, this.File);
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

    //загрузка справочников
    // await this.loadcontragent_interactions();
    // await this.loadfiles();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadcontragent_interaction_doc(id);
  }

  loadcontragent_interaction_doc = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interaction_doc(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.file_id = response.data.file_id;
          this.interaction_id = response.data.interaction_id;
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


  loadcontragent_interactions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interactions();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.contragent_interactions = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadfiles = async () => {
    // try {
    //   MainStore.changeLoader(true);
    //   const response = await getfiles();
    //   if ((response.status === 201 || response.status === 200) && response?.data !== null) {
    //     this.files = response.data
    //   } else {
    //     throw new Error();
    //   }
    // } catch (err) {
    //   MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    // } finally {
    //   MainStore.changeLoader(false);
    // }
  };


}

export default new NewStore();
