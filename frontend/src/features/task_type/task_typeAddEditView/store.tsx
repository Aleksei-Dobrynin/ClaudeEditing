import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { gettask_type } from "api/task_type";
import { createtask_type } from "api/task_type";
import { updatetask_type } from "api/task_type";

// dictionaries


class NewStore {
  id = 0
  name = ""
  code = ""
  description = ""
  is_for_task = false
  is_for_subtask = false
  icon_color = ""
  svg_icon_id = 0


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.name = ""
      this.code = ""
      this.description = ""
      this.is_for_task = false
      this.is_for_subtask = false
      this.icon_color = ""
      this.svg_icon_id = 0

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
      code: this.code,
      description: this.description,
      is_for_task: this.is_for_task,
      is_for_subtask: this.is_for_subtask,
      icon_color: this.icon_color,
      svg_icon_id: this.svg_icon_id - 0,
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
        response = await createtask_type(data);
      } else {
        response = await updatetask_type(data);
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

    this.loadtask_type(id);
  }

  loadtask_type = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await gettask_type(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.name = response.data.name;
          this.code = response.data.code;
          this.description = response.data.description;
          this.is_for_task = response.data.is_for_task;
          this.is_for_subtask = response.data.is_for_subtask;
          this.icon_color = response.data.icon_color;
          this.svg_icon_id = response.data.svg_icon_id;
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
