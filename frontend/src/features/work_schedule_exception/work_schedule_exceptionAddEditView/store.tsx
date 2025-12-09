import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getwork_schedule_exception } from "api/work_schedule_exception";
import { creatework_schedule_exception } from "api/work_schedule_exception";
import { updatework_schedule_exception } from "api/work_schedule_exception";

// dictionaries

import { getwork_schedules } from "api/work_schedule";


class NewStore {
  id = 0
  date_start = null
  date_end = null
  name = ""
  schedule_id = 0
  is_holiday = false
  time_start = null
  time_end = null


  errors: { [key: string]: string } = {};

  // Справочники
  work_schedules = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.date_start = null
      this.date_end = null
      this.name = ""
      this.schedule_id = 0
      this.is_holiday = false
      this.time_start = null
      this.time_end = null

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
      date_start: this.date_start,
      date_end: this.date_end,
      name: this.name,
      schedule_id: this.schedule_id - 0,
      is_holiday: this.is_holiday,
      time_start: this.time_start,
      time_end: this.time_end,
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
        response = await creatework_schedule_exception(data);
      } else {
        response = await updatework_schedule_exception(data);
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
    await this.loadwork_schedules();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadwork_schedule_exception(id);
  }

  loadwork_schedule_exception = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getwork_schedule_exception(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.date_start = response.data.date_start ? dayjs(response.data.date_start) : null;
          this.date_end = response.data.date_end ? dayjs(response.data.date_end) : null;
          this.name = response.data.name;
          this.schedule_id = response.data.schedule_id;
          this.is_holiday = response.data.is_holiday;
          this.time_start = response.data.time_start ? dayjs(response.data.time_start) : null;
          this.time_end = response.data.time_end ? dayjs(response.data.time_end) : null;
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
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


}

export default new NewStore();
