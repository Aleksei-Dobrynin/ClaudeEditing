import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsReminder } from "api/TemplCommsReminder/useGetTemplCommsReminder";
import { createTemplCommsReminder } from "api/TemplCommsReminder/useCreateTemplCommsReminder";
import { updateTemplCommsReminder } from "api/TemplCommsReminder/useUpdateTemplCommsReminder";
import dayjs from "dayjs";
import { getTemplRemindersDayss } from "api/TemplRemindersDays/useGetTemplRemindersDayss";
import { getTemplReminderRecipientsGroups } from "api/TemplReminderRecipientsGroup/useGetTemplReminderRecipientsGroups";

class NewStore {
  id = 0;
  template_id = 0;
  reminder_recipientsgroup_id = 0;
  reminder_days_id = 0;
  time_send_reminder = null;

  errors: { [key: string]: string } = {};

  // Справочники
  TemplRemindersDays = []
  TemplReminderRecipientsGroups = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.template_id = 0;
      this.reminder_recipientsgroup_id = 0;
      this.reminder_days_id = 0;
      this.time_send_reminder = null;
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
    const data = {
      id: this.id,
      template_id: this.template_id - 0,
      reminder_recipientsgroup_id: this.reminder_recipientsgroup_id - 0,
      reminder_days_id: this.reminder_days_id - 0,
      time_send_reminder: this.time_send_reminder,
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
        response = await createTemplCommsReminder(data);
      } else {
        response = await updateTemplCommsReminder(data);
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
  }

  async doLoad(id: number) {
    await this.loadTemplRemindersDays();
    await this.loadTemplReminderRecipientsGroups();
    
    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadTemplCommsReminder(id);
  }

  loadTemplCommsReminder = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsReminder(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.template_id = response.data.template_id;
          this.reminder_recipientsgroup_id = response.data.reminder_recipientsgroup_id;
          this.reminder_days_id = response.data.reminder_days_id;
          this.time_send_reminder = response.data.time_send_reminder;
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


  loadTemplRemindersDays = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplRemindersDayss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TemplRemindersDays = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTemplReminderRecipientsGroups = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplReminderRecipientsGroups();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TemplReminderRecipientsGroups = response.data
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
