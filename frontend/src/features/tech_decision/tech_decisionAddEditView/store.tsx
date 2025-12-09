import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { gettech_decision } from "api/tech_decision";
import { createtech_decision } from "api/tech_decision";
import { updatetech_decision } from "api/tech_decision";
// dictionaries
import { getarchitecture_processes } from "api/architecture_process";
import { getArchiveLogs } from "api/ArchiveLog/useGetArchiveLogs";

class NewStore {
  // Поля, соответствующие таблице tech_decision
  id: number = 0;
  name: string = "";
  code: string = "";
  description: string = "";
  name_kg: string = "";
  description_kg: string = "";
  text_color: string = "";
  background_color: string = "";
  created_at: dayjs.Dayjs | null = null;
  updated_at: dayjs.Dayjs | null = null;
  created_by: number | null = null;
  updated_by: number | null = null;

  errors: { [key: string]: string } = {};
  // Справочники
  architecture_processes: any[] = [];
  dutyplan_objects: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.code = "";
      this.description = "";
      this.name_kg = "";
      this.description_kg = "";
      this.text_color = "";
      this.background_color = "";
      this.created_at = null;
      this.updated_at = null;
      this.created_by = null;
      this.updated_by = null;
      this.errors = {};
    });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
    const data = {
      id: this.id,
      name: this.name,
      code: this.code,
      description: this.description,
      name_kg: this.name_kg,
      description_kg: this.description_kg,
      text_color: this.text_color,
      background_color: this.background_color,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by,
      updated_by: this.updated_by,
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
        response = await createtech_decision(data);
      } else {
        response = await updatetech_decision(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id);
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
  }

  async doLoad(id: number) {
    // Загрузка справочников
    await this.loadarchitecture_processes();
    await this.loaddutyplan_objects();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadtech_decision(id);
  }

  loadtech_decision = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await gettech_decision(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.code = response.data.code;
          this.description = response.data.description;
          this.name_kg = response.data.name_kg;
          this.description_kg = response.data.description_kg;
          this.text_color = response.data.text_color;
          this.background_color = response.data.background_color;
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

  loadarchitecture_processes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_processes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.architecture_processes = response.data;
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
        this.dutyplan_objects = response.data;
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