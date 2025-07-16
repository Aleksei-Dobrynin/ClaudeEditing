import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_task_assignee } from "api/application_task_assignee";
import { createapplication_task_assignee } from "api/application_task_assignee";
import { updateapplication_task_assignee } from "api/application_task_assignee";
import {getEmployeeInStructureGroup} from "api/EmployeeInStructure/useGetEmployeeInStructure"
import appTask_store from "../../application_task/application_taskAddEditView/store"
// dictionaries

import { getEmployeeInStructures } from "api/EmployeeInStructure/useGetEmployeeInStructures";


class NewStore {
  id = 0
  structure_employee_id = 0
  application_task_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0

  stucture_id = 0
  errors: { [key: string]: string } = {};

  // Справочники
  employees = []
  employeeInStructure = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.structure_employee_id = 0
      this.application_task_id = 0
      this.created_at = ""
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0

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
      application_task_id: this.application_task_id - 0,
      created_at: this.created_at === "" ? null : this.created_at,
      updated_at: this.updated_at === "" ? null : this.updated_at,
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
        response = await createapplication_task_assignee(data);
      } else {
        response = await updateapplication_task_assignee(data);
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
    await this.loademployees();
    await this.loadEmployeeInStructure(this.stucture_id)


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_task_assignee(id);
   
  }

  loadapplication_task_assignee = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_task_assignee(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.structure_employee_id = response.data.structure_employee_id;
          this.application_task_id = response.data.application_task_id;
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


  loademployees = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.employees = response.data
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
          this.employeeInStructure = response.data
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
