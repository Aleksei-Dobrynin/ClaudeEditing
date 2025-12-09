import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getarchirecture_road } from "api/archirecture_road";
import { createarchirecture_road } from "api/archirecture_road";
import { updatearchirecture_road } from "api/archirecture_road";

// dictionaries

import { getarchitecture_statuses } from "api/architecture_status";



class NewStore {
  id = 0
  updated_at = null
  created_by = 0
  updated_by = 0
  rule_expression = ""
  description = ""
  validation_url = ""
  post_function_url = ""
  is_active = false
  from_status_id = 0
  to_status_id = 0
  created_at = null


  errors: { [key: string]: string } = {};

  // Справочники
  architecture_statuses = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.rule_expression = ""
      this.description = ""
      this.validation_url = ""
      this.post_function_url = ""
      this.is_active = false
      this.from_status_id = 0
      this.to_status_id = 0
      this.created_at = null

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
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      rule_expression: this.rule_expression,
      description: this.description,
      validation_url: this.validation_url,
      post_function_url: this.post_function_url,
      is_active: this.is_active,
      from_status_id: this.from_status_id - 0,
      to_status_id: this.to_status_id - 0,
      created_at: this.created_at,
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
        response = await createarchirecture_road(data);
      } else {
        response = await updatearchirecture_road(data);
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
    await this.loadarchitecture_statuses();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadarchirecture_road(id);
  }

  loadarchirecture_road = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchirecture_road(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.rule_expression = response.data.rule_expression;
          this.description = response.data.description;
          this.validation_url = response.data.validation_url;
          this.post_function_url = response.data.post_function_url;
          this.is_active = response.data.is_active;
          this.from_status_id = response.data.from_status_id;
          this.to_status_id = response.data.to_status_id;
          this.created_at = dayjs(response.data.created_at);
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
