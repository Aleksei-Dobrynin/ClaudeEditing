import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getarchive_folder } from "api/archive_folder";
import { createarchive_folder } from "api/archive_folder";
import { updatearchive_folder } from "api/archive_folder";

// dictionaries

import { getArchiveLogs } from "api/ArchiveLog/useGetArchiveLogs";


class NewStore {
  id = 0
  archive_folder_name = ""
  dutyplan_object_id = 0
  folder_location = ""
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники
  dutyplan_objects = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.archive_folder_name = ""
      this.dutyplan_object_id = 0
      this.folder_location = ""
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
      archive_folder_name: this.archive_folder_name,
      dutyplan_object_id: this.dutyplan_object_id - 0,
      folder_location: this.folder_location,
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
        response = await createarchive_folder(data);
      } else {
        response = await updatearchive_folder(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response?.data?.id);
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
    // await this.loaddutyplan_objects();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadarchive_folder(id);
  }

  loadarchive_folder = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchive_folder(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.archive_folder_name = response.data.archive_folder_name;
          this.dutyplan_object_id = response.data.dutyplan_object_id;
          this.folder_location = response.data.folder_location;
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


  loaddutyplan_objects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dutyplan_objects = response.data
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
