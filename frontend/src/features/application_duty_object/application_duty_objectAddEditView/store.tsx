import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_duty_object } from "api/application_duty_object";
import { createapplication_duty_object } from "api/application_duty_object";
import { updateapplication_duty_object } from "api/application_duty_object";

// dictionaries

import { getarchitecture_processes } from "api/architecture_process";

import { getArchiveLogs } from "api/ArchiveLog/useGetArchiveLogs";


class NewStore {
  id = 0
  dutyplan_object_id = 0
  application_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  architecture_processes = []
  dutyplan_objects = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.dutyplan_object_id = 0
      this.application_id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0

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

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      dutyplan_object_id: this.dutyplan_object_id - 0,
      application_id: this.application_id - 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
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
        response = await createapplication_duty_object(data);
      } else {
        response = await updateapplication_duty_object(data);
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
    await this.loadarchitecture_processes();
    await this.loaddutyplan_objects();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_duty_object(id);
  }

  loadapplication_duty_object = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_duty_object(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.dutyplan_object_id = response.data.dutyplan_object_id;
          this.application_id = response.data.application_id;
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


  loadarchitecture_processes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_processes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.architecture_processes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loaddutyplan_objects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dutyplan_objects = response.data
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
