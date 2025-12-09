import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_application_log } from "api/structure_application_log";
import { createstructure_application_log } from "api/structure_application_log";
import { updatestructure_application_log } from "api/structure_application_log";
import { getStructures } from "api/Structure/useGetStructures";

// dictionaries


class NewStore {
  id = 0
  created_by = 0
  updated_by = 0
  updated_at = null
  created_at = null
  structure_id = 0
  application_id = 0
  status = ""
  status_code = ""
  Structures = []


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.created_by = 0
      this.updated_by = 0
      this.updated_at = null
      this.created_at = null
      this.structure_id = 0
      this.application_id = 0
      this.status = ""
      this.status_code = ""
      
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
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      updated_at: this.updated_at,
      created_at: this.created_at,
      structure_id: this.structure_id - 0,
      application_id: this.application_id - 0,
      status: this.status,
      status_code: this.status_code,
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
        response = await createstructure_application_log(data);
      } else {
        response = await updatestructure_application_log(data);
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

  async doLoad(id: number) {

    //загрузка справочников
    this.loadStructures()


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_application_log(id);
  }

  loadstructure_application_log = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_application_log(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.updated_at = dayjs(response.data.updated_at);
          this.created_at = dayjs(response.data.created_at);
          this.structure_id = response.data.structure_id;
          this.application_id = response.data.application_id;
          this.status = response.data.status;
          this.status_code = response.data.status_code;
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
