import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_tag_application } from "api/structure_tag_application";
import { createstructure_tag_application } from "api/structure_tag_application";
import { updatestructure_tag_application } from "api/structure_tag_application";

// dictionaries

import { getstructure_tags } from "api/structure_tag";

import { getorg_structures } from "api/org_structure";


class NewStore {
  id = 0
  structure_tag_id = 0
  application_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  structure_id = 0


  errors: { [key: string]: string } = {};

  // Справочники
  structure_tags = []
  org_structures = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.structure_tag_id = 0
      this.application_id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.structure_id = 0

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
      structure_tag_id: this.structure_tag_id - 0,
      application_id: this.application_id - 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      structure_id: this.structure_id - 0,
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
        response = await createstructure_tag_application(data);
      } else {
        response = await updatestructure_tag_application(data);
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
    await this.loadstructure_tags();
    await this.loadorg_structures();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_tag_application(id);
  }

  loadstructure_tag_application = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_tag_application(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.structure_tag_id = response.data.structure_tag_id;
          this.application_id = response.data.application_id;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.structure_id = response.data.structure_id;
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


  loadstructure_tags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_tags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structure_tags = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data
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
