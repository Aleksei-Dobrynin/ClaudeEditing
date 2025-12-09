import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplTemplateComms } from "api/TemplTemplateComms/useGetTemplTemplateComms";
import { createTemplTemplateComms } from "api/TemplTemplateComms/useCreateTemplTemplateComms";
import { updateTemplTemplateComms } from "api/TemplTemplateComms/useUpdateTemplTemplateComms";
import dayjs from "dayjs";
import { getTemplRemindersDayss } from "api/TemplRemindersDays/useGetTemplRemindersDayss";

class NewStore {
  id = 0;
  name = "";
  description = "";
  is_send_report = false;
  reminder_days_id = 0;
  time_send_report = null;
  

  errors: { [key: string]: string } = {};

  // Справочники
  TemplRemindersDayss = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.description = "";
      this.reminder_days_id = 0;
      this.is_send_report = false;
      this.time_send_report = null;
      this.errors = {};
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
      this.errors[name] = ""; // Убираем ошибку, если валидация успешна
    } else {
      this.errors[name] = error; // Устанавливаем ошибку, если валидация не успешна
    }
  }


  onSaveClick = async (onSaved: (id: number) => void) => {
    var data = {
      id: this.id,
      name: this.name,
      reminder_days_id: this.reminder_days_id - 0,
      description: this.description,
      is_send_report: this.is_send_report,
      time_send_report: this.time_send_report,
      owner_entity_id: 1,
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
        response = await createTemplTemplateComms(data);
      } else {
        response = await updateTemplTemplateComms(data);
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

    await this.loadTemplRemindersDayss();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadTemplTemplateComms(id);
  }

  loadTemplTemplateComms = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplTemplateComms(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id
          this.name = response.data.name
          this.description = response.data.description
          this.is_send_report = response.data.is_send_report
          this.reminder_days_id = response.data.reminder_days_id
          this.time_send_report = response.data.time_send_report
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


  loadTemplRemindersDayss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplRemindersDayss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TemplRemindersDayss = response.data
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
