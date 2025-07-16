import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsAccess } from "api/TemplCommsAccess/useGetTemplCommsAccess";
import { createTemplCommsAccess } from "api/TemplCommsAccess/useCreateTemplCommsAccess";
import { updateTemplCommsAccess } from "api/TemplCommsAccess/useUpdateTemplCommsAccess";
import dayjs from "dayjs";
import { getTemplTypeAccessSurveys } from "api/TemplTypeAccessSurvey/useGetTemplTypeAccessSurveys";

class NewStore {
  id = 0;
  name = "";
  template_comms_id = 0;
  type_access_survey_id = 0;

  errors: { [key: string]: string } = {};

  // Справочники
  TemplTypeAccessSurveys = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.template_comms_id = 0;
      this.type_access_survey_id = 0;
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
      template_comms_id: this.template_comms_id - 0,
      type_access_survey_id: this.type_access_survey_id - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }


    try {
      MainStore.changeLoader(true);
      var data = {
        id: this.id,
        template_comms_id: this.template_comms_id - 0,
        type_access_survey_id: this.type_access_survey_id - 0,
      };
      let response;
      if (this.id === 0) {
        response = await createTemplCommsAccess(data);
      } else {
        response = await updateTemplCommsAccess(data);
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
    await this.loadTemplTypeAccessSurveys();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadTemplCommsAccess(id);
  }

  loadTemplCommsAccess = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsAccess(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.template_comms_id = response.data.template_comms_id;
          this.type_access_survey_id = response.data.type_access_survey_id;
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


  loadTemplTypeAccessSurveys = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplTypeAccessSurveys();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TemplTypeAccessSurveys = response.data
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
