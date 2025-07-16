import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getorg_structure } from "api/org_structure";
import { createorg_structure } from "api/org_structure";
import { updateorg_structure } from "api/org_structure";
import { getorg_structures } from "api/org_structure";

// dictionaries


class NewStore {
  id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  parent_id = 0
  unique_id = ""
  name = ""
  version = 0
  is_active = false
  date_start = null
  date_end = null
  remote_id = ""
  short_name = ""


  errors: { [key: string]: string } = {};

  // Справочники
  org_structures = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.parent_id = 0
      this.unique_id = ""
      this.name = ""
      this.version = 0
      this.is_active = false
      this.date_start = null
      this.date_end = null
      this.remote_id = ""
      this.short_name =""

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
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      parent_id: this.parent_id - 0 === 0 ? null : this.parent_id - 0,
      unique_id: this.unique_id,
      name: this.name,
      version: this.version - 0 === 0 ? null : this.version - 0,
      is_active: this.is_active,
      date_start: this.date_start,
      date_end: this.date_end,
      remote_id: this.remote_id,
      short_name: this.short_name
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
        response = await createorg_structure(data);
      } else {
        response = await updateorg_structure(data);
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
    await this.loadorg_structures();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadorg_structure(id);
  }

  loadorg_structure = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structure(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.created_at = response.data.created_at ? dayjs(response.data.created_at) : null;
          this.updated_at = response.data.updated_at ? dayjs(response.data.updated_at) : null;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.parent_id = response.data.parent_id;
          this.unique_id = response.data.unique_id;
          this.name = response.data.name;
          this.version = response.data.version;
          this.is_active = response.data.is_active;
          this.date_start = response.data.date_start ? dayjs(response.data.date_start) : null;
          this.date_end = response.data.date_end ? dayjs(response.data.date_end) : null;
          this.remote_id = response.data.remote_id;
          this.short_name = response.data.short_name;
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
