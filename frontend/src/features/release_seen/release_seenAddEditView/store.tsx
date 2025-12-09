import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getrelease_seen } from "api/release_seen";
import { createrelease_seen } from "api/release_seen";
import { updaterelease_seen } from "api/release_seen";

// dictionaries

import { getreleases } from "api/release";


class NewStore {
  id = 0
  release_id = 0
  user_id = 0
  date_issued = null
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  releases = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.release_id = 0
      this.user_id = 0
      this.date_issued = null
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
      release_id: this.release_id - 0,
      user_id: this.user_id - 0,
      date_issued: this.date_issued,
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
        response = await createrelease_seen(data);
      } else {
        response = await updaterelease_seen(data);
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
    await this.loadreleases();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadrelease_seen(id);
  }

  loadrelease_seen = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getrelease_seen(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.release_id = response.data.release_id;
          this.user_id = response.data.user_id;
          this.date_issued = dayjs(response.data.date_issued);
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


  loadreleases = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getreleases();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.releases = response.data
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
