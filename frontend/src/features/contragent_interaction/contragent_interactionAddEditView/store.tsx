import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getcontragent_interaction } from "api/contragent_interaction";
import { createcontragent_interaction } from "api/contragent_interaction";
import { updatecontragent_interaction } from "api/contragent_interaction";

// dictionaries

import { getapplication_tasks, getapplication_tasksByapplication_id } from "api/application_task";

import { getContragents } from "api/Contragent/useGetContragents";



class NewStore {
  id = 0
  updated_by = 0
  application_id = 0
  task_id = 0
  contragent_id = 0
  description = ""
  progress = 0
  name = ""
  created_at = null
  updated_at = null
  created_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  application_tasks = []
  contragents = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.updated_by = 0
      this.application_id = 0
      this.task_id = 0
      this.contragent_id = 0
      this.description = ""
      this.progress = 0
      this.name = ""
      this.created_at = null
      this.updated_at = null
      this.created_by = 0

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

  async onSaveClick(onSaved: (id: number, isNew: boolean) => void) {
    var data = {

      id: this.id - 0,
      updated_by: this.updated_by - 0,
      application_id: this.application_id - 0,
      task_id: this.task_id - 0 === 0 ? null : this.task_id - 0,
      contragent_id: this.contragent_id - 0,
      description: this.description,
      progress: this.progress - 0,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createcontragent_interaction(data);
      } else {
        response = await updatecontragent_interaction(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id, data.id === 0);
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
    this.loadcontragents();
    this.loadapplication_tasks();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadcontragent_interaction(id);
  }

  loadcontragent_interaction = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interaction(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.updated_by = response.data.updated_by;
          this.application_id = response.data.application_id;
          this.task_id = response.data.task_id;
          this.contragent_id = response.data.contragent_id;
          this.description = response.data.description;
          this.progress = response.data.progress;
          this.name = response.data.name;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
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


  loadapplication_tasks = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_tasksByapplication_id(this.application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_tasks = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadcontragents = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getContragents();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.contragents = response.data
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
