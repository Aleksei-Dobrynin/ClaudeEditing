import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getevent_type } from "api/EventType";
import { createevent_type } from "api/EventType";
import { updateevent_type } from "api/EventType";

// dictionaries

class NewStore {
  id = 0
  name = ""
  description = ""
  code = ""
  name_kg = ""
  description_kg = ""

  errors: { [key: string]: string } = {};

  // Справочники

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.name = ""
      this.description = ""
      this.code = ""
      this.name_kg = ""
      this.description_kg = ""
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
      description: this.description,
      code: this.code,
      name_kg: this.name_kg,
      description_kg: this.description_kg,
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
        response = await createevent_type(data);
      } else {
        response = await updateevent_type(data);
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

    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadevent_type(id);
  }

  loadevent_type = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getevent_type(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.name_kg = response.data.name_kg;
          this.description_kg = response.data.description_kg;
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
}

export default new NewStore();