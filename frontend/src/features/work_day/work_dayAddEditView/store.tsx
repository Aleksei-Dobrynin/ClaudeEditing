import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getwork_day } from "api/work_day";
import { creatework_day } from "api/work_day";
import { updatework_day } from "api/work_day";

// dictionaries

import { getwork_schedules } from "api/work_schedule";


class NewStore {
  id = 0
  week_number = 0
  time_start = null
  time_end = null
  schedule_id = 0
  Days = [
    {id: 1, name: "Понедельник"},
    {id: 2, name: "Вторник"},
    {id: 3, name: "Среда"},
    {id: 4, name: "Четверг"},
    {id: 5, name: "Пятница"},
    {id: 6, name: "Суббота"},
    {id: 7, name: "Воскресенье"},
  ]

  errors: { [key: string]: string } = {};

  // Справочники
  work_schedules = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.week_number = 0
      this.time_start = null
      this.time_end = null
      this.schedule_id = 0

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
      week_number: this.week_number - 0,
      time_start: this.time_start,
      time_end: this.time_end,
      schedule_id: this.schedule_id - 0,
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
        response = await creatework_day(data);
      } else {
        response = await updatework_day(data);
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

      let errorMessage = err?.response?.data?.errorMessage || i18n.t("message:somethingWentWrong");
      if (err?.response?.data?.fieldErrors != null) {
        let fieldErrors = err?.response?.data?.fieldErrors;
        for (let i = 0; i < fieldErrors.length; i++) {
          if (this.errors[fieldErrors[i].fieldName] != null) {
            this.errors[fieldErrors[i].fieldName] = fieldErrors[i].errorMessage;
          }
        }
      }
      MainStore.setSnackbar(errorMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadwork_schedules();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadwork_day(id);
  }

  loadwork_day = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getwork_day(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.week_number = response.data.week_number;
          this.time_start = response.data.time_start ? dayjs(response.data.time_start) : null;
          this.time_end = response.data.time_end ? dayjs(response.data.time_end) : null;
          this.schedule_id = response.data.schedule_id;
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      let errorMessage = err?.response?.data?.errorMessage || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(errorMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  loadwork_schedules = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getwork_schedules();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.work_schedules = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      let errorMessage = err?.response?.data?.errorMessage || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(errorMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


}

export default new NewStore();
