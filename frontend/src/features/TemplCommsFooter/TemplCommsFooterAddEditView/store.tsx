import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsFooter } from "api/TemplCommsFooter/useGetTemplCommsFooter";
import { createTemplCommsFooter } from "api/TemplCommsFooter/useCreateTemplCommsFooter";
import { updateTemplCommsFooter } from "api/TemplCommsFooter/useUpdateTemplCommsFooter";
import dayjs from "dayjs";
import { getDictionaryLanguages } from "api/DictionaryLanguage/useGetDictionaryLanguages";

class NewStore {
  id = 0;
  name = "";
  template_comms_id = 0;
  language_id = 0;
  footer_email = "";

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
      this.footer_email = "";
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
      footer_email: this.footer_email,
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
        response = await createTemplCommsFooter(data);
      } else {
        response = await updateTemplCommsFooter(data);
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
    this.loadTemplCommsFooter(id);
  }

  loadTemplCommsFooter = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsFooter(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.template_comms_id = response.data.template_comms_id;
          this.language_id = response.data.language_id;
          this.footer_email = response.data.footer_email;
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
