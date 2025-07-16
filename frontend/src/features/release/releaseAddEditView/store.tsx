import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getrelease } from "api/release";
import { createrelease } from "api/release";
import { updaterelease } from "api/release";

// dictionaries


class NewStore {
  id = 0
  updated_by = 0
  number = ""
  description = ""
  description_kg = ""
  code = ""
  date_start: Dayjs = null
  created_at = null
  updated_at = null
  created_by = 0
  files: File[] = []
  videos = []


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.updated_by = 0
      this.number = ""
      this.description = ""
      this.description_kg = ""
      this.code = ""
      this.date_start = null
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.files = []
      this.videos = []

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  deleteVideo(id: number){
    this.videos = this.videos.filter(x => x.id !== id)
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
      number: this.number,
      description: this.description,
      description_kg: this.description_kg,
      code: this.code,
      date_start: this.date_start?.format('YYYY-MM-DDTHH:mm:ss'),
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
        response = await createrelease(data, this.files);
      } else {
        response = await updaterelease(data, this.files, this.videos);
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

    this.loadrelease(id);
  }

  loadrelease = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getrelease(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.number = response.data.number;
          this.description = response.data.description;
          this.description_kg = response.data.description_kg;
          this.code = response.data.code;
          this.date_start = response.data.date_start ? dayjs(response.data.date_start) : null;
          this.videos = response.data.videos
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
