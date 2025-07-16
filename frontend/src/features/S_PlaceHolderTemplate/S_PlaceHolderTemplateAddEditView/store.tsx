import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getS_PlaceHolderTemplate } from "api/S_PlaceHolderTemplate";
import { createS_PlaceHolderTemplate } from "api/S_PlaceHolderTemplate";
import { updateS_PlaceHolderTemplate } from "api/S_PlaceHolderTemplate";

// dictionaries

import { getS_Querys } from "api/S_Query";

import { getS_PlaceHolderTypes } from "api/S_PlaceHolderType";


class NewStore {
  id = 0
  name = ""
  value = ""
  code = ""
  idQuery = 0
  idPlaceholderType = 0


  errors: { [key: string]: string } = {};

  // Справочники
  S_Querys = []
  S_PlaceHolderTypes = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.name = ""
      this.value = ""
      this.code = ""
      this.idQuery = 0
      this.idPlaceholderType = 0
      this.errors = {}

    });
  }

  handleChange(event: any) {
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

      value: this.value,

      code: this.code,

      idQuery: this.idQuery - 0,

      idPlaceholderType: this.idPlaceholderType - 0,

    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response: any;
      if (this.id === 0) {
        response = await createS_PlaceHolderTemplate(data);
      } else {
        response = await updateS_PlaceHolderTemplate(data);
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
    await this.loadS_Querys();
    await this.loadS_PlaceHolderTypes();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadS_PlaceHolderTemplate(id);
  }

  loadS_PlaceHolderTemplate = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_PlaceHolderTemplate(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.name = response.data.name;
          this.value = response.data.value;
          this.code = response.data.code;
          this.idQuery = response.data.idQuery;
          this.idPlaceholderType = response.data.idPlaceholderType;
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


  loadS_Querys = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_Querys();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_Querys = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadS_PlaceHolderTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_PlaceHolderTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_PlaceHolderTypes = response.data
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
