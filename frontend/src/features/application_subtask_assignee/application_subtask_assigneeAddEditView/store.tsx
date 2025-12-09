import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_subtask_assignee } from "api/application_subtask_assignee";
import { createapplication_subtask_assignee } from "api/application_subtask_assignee";
import { updateapplication_subtask_assignee } from "api/application_subtask_assignee";

// dictionaries

import { getEmployeeInStructures } from "api/EmployeeInStructure/useGetEmployeeInStructures";
import {getEmployeeInStructureGroup} from "api/EmployeeInStructure/useGetEmployeeInStructure"
import { getapplication_subtasks } from "api/application_subtask";


class NewStore {
  id = 0
  structure_employee_id = 0
  application_subtask_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  structure_id = 0


  errors: { [key: string]: string } = {};

  // Справочники
  employee_in_structures = []
  application_subtasks = []
  employeesInStructure = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.structure_employee_id = 0
      this.application_subtask_id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.structure_id = 0

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
      structure_employee_id: this.structure_employee_id - 0,
      application_subtask_id: this.application_subtask_id - 0,
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
        response = await createapplication_subtask_assignee(data);
      } else {
        response = await updateapplication_subtask_assignee(data);
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
    await this.loademployee_in_structures();
    await this.loadapplication_subtasks();
    await this.loadEmployeeInStructure(this.structure_id);
    

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_subtask_assignee(id);
  }

  loadapplication_subtask_assignee = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_subtask_assignee(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.structure_employee_id = response.data.structure_employee_id;
          this.application_subtask_id = response.data.application_subtask_id;
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


  loademployee_in_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.employee_in_structures = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadapplication_subtasks = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_subtasks();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_subtasks = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEmployeeInStructure = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructureGroup(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employeesInStructure = response.data
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
