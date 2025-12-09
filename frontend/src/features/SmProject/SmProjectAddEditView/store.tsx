import { makeAutoObservable, runInAction } from "mobx";
import { validate, validateField } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSmProject } from "api/SmProject";
import { createSmProject } from "api/SmProject";
import { updateSmProject } from "api/SmProject";
import dayjs from "dayjs";
import { getSmProjectTypes } from "api/SmProjectType";
import { getEntities } from "api/Entity";
import { getSmProjectFrequencies } from "api/SmProjectFrequency";
import { getEntityAttributes } from "api/EntityAttributes";
import { getSmProjectStatuses } from "api/SmProjectStatus";

class NewStore {
  id = 0;
  name = "";
  projecttype_id = 1;
  test = false;
  status_id = 0;
  min_responses = 0;
  date_end = null;
  access_link = "";
  entity_id = 0;
  frequency_id = 0;
  is_triggers_required = false;
  date_attribute_milestone_id = 0;

  errors: { [key: string]: string } = {};

  // Справочники
  SmProjectTypes = []
  SmProjectStatuses = []
  Entities = []
  SmProjectFrequencies = []
  EntityAttributes = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.projecttype_id = 0;
      this.test = false;
      this.status_id = 0;
      this.min_responses = 0;
      this.date_end = null;
      this.access_link = "";
      this.entity_id = 0;
      this.frequency_id = 0;
      this.is_triggers_required = false;
      this.date_attribute_milestone_id = 0;
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


  async onSaveClick(onSaved: (id: number) => void) {
    var data = {
      id: this.id,
      name: this.name,
      projecttype_id: this.projecttype_id - 0,
      test: this.test,
      status_id: this.status_id - 0,
      min_responses: this.min_responses - 0,
      date_end: this.date_end,
      access_link: this.access_link,
      entity_id: this.entity_id - 0,
      frequency_id: this.frequency_id - 0,
      is_triggers_required: this.is_triggers_required,
      date_attribute_milestone_id: this.date_attribute_milestone_id - 0,
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
        response = await createSmProject(data);
      } else {
        response = await updateSmProject(data);
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

    this.loadProjectStatuses();
    this.loadProjectTypes();
    this.loadEntityAttributes();
    this.loadEntities();
    this.loadSmProjectFrequencies();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadSmProject(id);
  }

  loadSmProject = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmProject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.projecttype_id = response.data.projecttype_id;
          this.test = response.data.test;
          this.status_id = response.data.status_id;
          this.min_responses = response.data.min_responses;
          this.date_end = dayjs(response.data.date_end);
          this.access_link = response.data.access_link;
          this.entity_id = response.data.entity_id;
          this.frequency_id = response.data.frequency_id;
          this.is_triggers_required = response.data.is_triggers_required;
          this.date_attribute_milestone_id = response.data.date_attribute_milestone_id;
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


  loadProjectTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmProjectTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SmProjectTypes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadProjectStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmProjectStatuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SmProjectStatuses = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEntities = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEntities();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Entities = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadSmProjectFrequencies = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmProjectFrequencies();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SmProjectFrequencies = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEntityAttributes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEntityAttributes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.EntityAttributes = response.data
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
