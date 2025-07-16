import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getpath_step } from "api/path_step";
import { createpath_step } from "api/path_step";
import { updatepath_step } from "api/path_step";

// dictionaries

import { getservice_paths } from "api/service_path";
import { getStructures } from "../../../api/Structure/useGetStructures";



class NewStore {
  id = 0
  step_type = ""
  path_id = 0
  responsible_org_id = 0
  name = ""
  description = ""
  order_number = 0
  is_required = false
  estimated_days = 0
  wait_for_previous_steps = false
  Structures = [];



  errors: { [key: string]: string } = {};

  // Справочники
  service_paths = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.step_type = ""
      this.path_id = 0
      this.responsible_org_id = 0
      this.name = ""
      this.description = ""
      this.order_number = 0
      this.is_required = false
      this.estimated_days = 0
      this.wait_for_previous_steps = false
      this.Structures = [];


      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    let newValue = value;
    
    // Обработка checkbox
    if (type === 'checkbox') {
      newValue = checked;
    }
    // Преобразуем строковое значение в число для числовых полей
    else if (['responsible_org_id', 'path_id', 'order_number', 'estimated_days'].includes(name)) {
      newValue = parseInt(value) || 0;
    }
    
    (this as any)[name] = newValue;
    this.validateField(name, newValue);
  }

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

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
      step_type: this.step_type,
      path_id: this.path_id - 0,
      responsible_org_id: this.responsible_org_id - 0,
      name: this.name,
      description: this.description,
      order_number: this.order_number - 0,
      is_required: this.is_required,
      estimated_days: this.estimated_days - 0,
      wait_for_previous_steps: this.wait_for_previous_steps,
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
        response = await createpath_step(data);
      } else {
        response = await updatepath_step(data);
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
    await this.loadStructures()
    await this.loadservice_paths();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadpath_step(id);
  }

  loadpath_step = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getpath_step(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.step_type = response.data.step_type;
          this.path_id = response.data.path_id;
          this.responsible_org_id = response.data.responsible_org_id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.order_number = response.data.order_number;
          this.is_required = response.data.is_required;
          this.estimated_days = response.data.estimated_days;
          this.wait_for_previous_steps = response.data.wait_for_previous_steps;
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


  loadservice_paths = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getservice_paths();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.service_paths = response.data
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