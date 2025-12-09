import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getreestr } from "api/reestr";
import { createreestr } from "api/reestr";
import { updatereestr } from "api/reestr";

// dictionaries


import { getreestr_statuses } from "api/reestr_status";
import { MONTHS } from "constants/constant";


class NewStore {
  id = 0
  name = ""
  month = 0
  year = 0
  status_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  reestr_statuses = []
  months = MONTHS
  years = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.name = ""
      this.month = 0
      this.year = 0
      this.status_id = 0
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
      name: this.name,
      month: this.month - 0,
      year: this.year - 0,
      status_id: this.status_id - 0,
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
        response = await createreestr(data);
      } else {
        response = await updatereestr(data);
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

  loadYears = () => {
    const now = dayjs();
    const year = now.year();
    let years = []

    for (let index = 0; index < 5; index++) {
      years.push({ name: year - index, id: year - index })
    }
    this.year = year;
    this.years = years

  }

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadreestr_statuses();
    this.loadYears();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadreestr(id);
  }

  loadreestr = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getreestr(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.name = response.data.name;
          this.month = response.data.month;
          this.year = response.data.year;
          this.status_id = response.data.status_id;
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


  loadreestr_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getreestr_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.reestr_statuses = response.data
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
