import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_report_config } from "api/structure_report_config";
import { createstructure_report_config } from "api/structure_report_config";
import { updatestructure_report_config } from "api/structure_report_config";
import { getorg_structures } from "api/org_structure";

// dictionaries


class NewStore {
  id = 0
  structure_id = 0
  // created_at = null
  // updated_at = null
  // created_by = 0
  // updated_by = 0
  is_active = false
  name = ""
  org_structures = []


  errors: { [key: string]: string } = {};

  // Справочники

  async loadorg_structures() {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.structure_id = 0
      // this.created_at = null
      // this.updated_at = null
      // this.created_by = 0
      // this.updated_by = 0
      this.is_active = false
      this.name = ""

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
      structureId: this.structure_id - 0,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
      // created_by: this.created_by - 0,
      // updated_by: this.updated_by - 0,
      isActive: this.is_active,
      name: this.name,
    };

    // const { isValid, errors } = await validate(data);
    // if (!isValid) {
    //   this.errors = errors;
    //   MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    //   return;
    // }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createstructure_report_config(data);
      } else {
        response = await updatestructure_report_config(data);
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
    this.loadorg_structures()
    //загрузка справочников


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_report_config(id);
  }

  loadstructure_report_config = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report_config(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.structure_id = response.data.structureId;
          // this.created_at = dayjs(response.data.created_at);
          // this.updated_at = dayjs(response.data.updated_at);
          // this.created_by = response.data.created_by;
          // this.updated_by = response.data.updated_by;
          this.is_active = response.data.isActive;
          this.name = response.data.name;
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
