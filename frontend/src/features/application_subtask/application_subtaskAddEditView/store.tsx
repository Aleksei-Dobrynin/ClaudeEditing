import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { changeSubTaskStatus, getapplication_subtask } from "api/application_subtask";
import { createapplication_subtask } from "api/application_subtask";
import { updateapplication_subtask } from "api/application_subtask";
import storeList from "./../application_subtaskListView/store";

// dictionaries

import { getWorkflowTaskTemplates } from "api/WorkflowTaskTemplate/useGetWorkflowTaskTemplates";

import { gettask_statuses } from "api/task_status";

import { getapplication_task, getapplication_tasks } from "api/application_task";
import { gettask_types } from "api/task_type";
import { ErrorResponseCode } from "constants/constant";
import { getEmployeeInStructureGroup } from "api/EmployeeInStructure/useGetEmployeeInStructure";


class NewStore {
  id = 0
  updated_at = null
  created_by = 0
  updated_by = 0
  application_id = 0
  subtask_template_id = 0
  name = ""
  status_id = 0
  type_id = 0
  progress = 0
  application_task_id = 0
  description = ""
  created_at = null
  application_task_name = ""
  application_number = ""
  changed = false
  structure_id = 0;
  subtask_deadline = "";
  openPanelPopup = false;
  assignees = []
  addAssignePopup = false;
  application_task_structure_id = 0;


  errors: { [key: string]: string } = {};

  // Справочники
  workflow_subtask_templates = []
  task_statuses = []
  task_types = []
  application_tasks = []
  employeeInStructure = []
  structure_employee_id = 0;

  firstSaved = false

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0
      this.application_id = 0
      this.subtask_template_id = 0
      this.name = ""
      this.status_id = 0
      this.type_id = 0
      this.progress = 0
      this.application_task_id = 0
      this.description = ""
      this.created_at = ""
      this.application_task_name = ""
      this.application_number = ""
      this.changed = false;
      this.firstSaved = false;
      this.structure_id = 0
      this.subtask_deadline = ""
      this.errors = {}
      this.assignees = []
      this.addAssignePopup = false;
      this.structure_employee_id = 0;
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.changed = true;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  changeDeadline(date: Dayjs) {
    if (date) {
      this.subtask_deadline = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.subtask_deadline = null
    }
  }
  onEditClicked = (id: number) => {
    this.id = id;
    this.openPanelPopup = true
  }
  closePopup = () => {
    this.openPanelPopup = false
  }

  deleteAssign = (id: number) => {
    this.assignees = this.assignees.filter(x => x.id !== id)
  }
  onAddAssign = () => {
    this.addAssignePopup = true;
  }

  onAddAssigneeDoneClick = () => {
    if (this.structure_employee_id == 0) {
      this.errors.structure_employee_id = "Нужно кого-то выбрать!"
      return;
    }
    const emp = this.employeeInStructure.find(x => x.id === this.structure_employee_id)
    this.assignees = [...this.assignees, {
      id: (this.assignees.length + 1) * -1,
      application_subtask_id: this.id,
      employee_name: emp?.employee_name,
      structure_employee_id: emp?.id
    }]
    this.structure_employee_id = 0;
    this.addAssignePopup = false;
  }
  onAddAssigneeCancelClick = () => {
    this.addAssignePopup = false
    this.structure_employee_id = 0
  }


  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  changeApplicationTaskId(id: number) {
    this.application_task_id = id
    this.loadapplication_task(id)
  }

  async changeStatus(id: number, status_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await changeSubTaskStatus(id, status_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status_id
        storeList.loadapplication_subtasks()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      created_at: this.created_at === "" ? null : this.created_at,
      updated_at: this.updated_at === "" ? null : this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      application_id: this.application_id - 0 === 0 ? null : this.application_id - 0,
      subtask_template_id: this.subtask_template_id - 0 === 0 ? null : this.subtask_template_id - 0,
      name: this.name,
      status_id: this.status_id - 0,
      type_id: this.type_id - 0 === 0 ? null : this.type_id - 0,
      progress: this.progress - 0,
      application_task_id: this.application_task_id - 0,
      description: this.description,
      assignees: this.assignees,
      subtask_deadline: this.subtask_deadline
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
        response = await createapplication_subtask(data);
      } else {
        response = await updateapplication_subtask(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id);
        this.changed = false;
        if (data.id === 0) {
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        } else {
          MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
        }
      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.ALREADY_UPDATED) {
        MainStore.openErrorDialog(i18n.t("message:snackbar.alreadyUpdated"), "Не получилось обновить")
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
    this.loadtask_types();
    this.loadEmployeeInStructure()


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_subtask(id);
  }

  loadapplication_subtask = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_subtask(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.updated_at = response.data.updated_at;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.application_id = response.data.application_id;
          this.subtask_template_id = response.data.subtask_template_id;
          this.name = response.data.name;
          this.status_id = response.data.status_id;
          this.type_id = response.data.type_id;
          this.progress = response.data.progress;
          this.application_task_id = response.data.application_task_id;
          this.description = response.data.description;
          this.created_at = dayjs(response.data.created_at);
          this.application_task_name = response.data.application_task_name;
          this.application_number = response.data.application_number;
          this.subtask_deadline = response.data.subtask_deadline;
          this.assignees = response.data.assignees
          this.application_task_structure_id = response.data.application_task_structure_id;
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
  loadEmployeeInStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructureGroup(this.application_task_structure_id);
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


  loadworkflow_subtask_templates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.workflow_subtask_templates = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadtask_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await gettask_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.task_statuses = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadtask_types = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await gettask_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.task_types = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadapplication_tasks = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_tasks();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_tasks = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadapplication_task = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_task(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.application_task_name = response.data.name;
          this.application_number = response.data.application_number;
          this.application_id = response.data.application_id
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
