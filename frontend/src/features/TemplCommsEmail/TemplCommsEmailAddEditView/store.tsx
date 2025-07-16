import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsEmail } from "api/TemplCommsEmail/useGetTemplCommsEmail";
import { createTemplCommsEmail } from "api/TemplCommsEmail/useCreateTemplCommsEmail";
import { updateTemplCommsEmail } from "api/TemplCommsEmail/useUpdateTemplCommsEmail";
import dayjs from "dayjs";
import { getDictionaryLanguages } from "api/DictionaryLanguage/useGetDictionaryLanguages";

class NewStore {
  id = 0;
  name = "";
  template_comms_id = 0;
  comms_reminder_id = 0;
  language_id = 0;
  body_email = "";
  subject_email = "";
  is_for_report = false;
  
  errors: { [key: string]: string } = {};

  // Справочники
  DictionaryLanguages = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.template_comms_id = 0;
      this.language_id = 0;
      this.comms_reminder_id = 0;
      this.body_email = "";
      this.subject_email = "";
      this.is_for_report = false;
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
      template_comms_id: this.template_comms_id - 0,
      language_id: this.language_id - 0,
      comms_reminder_id: this.comms_reminder_id - 0 === 0 ? null : this.comms_reminder_id - 0,
      body_email: this.body_email,
      subject_email: this.subject_email,
      is_for_report: this.is_for_report,
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
        response = await createTemplCommsEmail(data);
      } else {
        response = await updateTemplCommsEmail(data);
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
    await this.loadDictionaryLanguages();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadTemplCommsEmail(id);
  }

  loadTemplCommsEmail = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsEmail(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.template_comms_id = response.data.template_comms_id;
          this.comms_reminder_id = response.data.comms_reminder_id;
          this.language_id = response.data.language_id;
          this.body_email = response.data.body_email;
          this.subject_email = response.data.subject_email;
          this.is_for_report = response.data.is_for_report;
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


  loadDictionaryLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDictionaryLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.DictionaryLanguages = response.data
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
