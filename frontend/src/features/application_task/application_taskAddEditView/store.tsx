import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { changeTaskStatus, getapplication_task } from "api/application_task";
import { createapplication_task } from "api/application_task";
import { updateapplication_task } from "api/application_task";

// dictionaries

import { getWorkflowTaskTemplates } from "api/WorkflowTaskTemplate/useGetWorkflowTaskTemplates";

import { gettask_statuses } from "api/task_status";
import { getorg_structures } from "api/org_structure";
import { gettask_types } from "api/task_type";
import { getApplication } from "api/Application/useGetApplication";
import { changeSubTaskStatus } from "api/application_subtask";
import subTaskStore from "../../application_subtask/application_subtaskAddEditView/store"
import { ErrorResponseCode } from "constants/constant";
import { getEmployeeInStructureGroup } from "api/EmployeeInStructure/useGetEmployeeInStructure";


class NewStore {
  id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  structure_id = 0
  application_id = 0
  application_number = ""
  task_template_id = 0
  comment = ""
  name = ""
  is_required = false
  order = 0
  status_id = 0
  type_id = 0
  progress = 0
  deadline = null;
  FileName = "";
  File = null;
  idDocumentinputKey = "";
  addAssignePopup = false;
  structure_employee_id = 0

  employeeInStructure = []
  assignees = []



  changed = false

  errors: { [key: string]: string } = {};

  // Справочники
  workflow_task_templates = []
  task_statuses = []
  task_types = []
  org_structures = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.created_at = ""
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0
      this.structure_id = 0
      this.application_id = 0
      this.application_number = ''
      this.task_template_id = 0
      this.comment = ""
      this.name = ""
      this.is_required = false
      this.order = 0
      this.status_id = 0
      this.type_id = 0
      this.progress = 0
      this.changed = false;
      this.deadline = null;
      this.FileName = "";
      this.File = null;
      this.idDocumentinputKey = Math.random().toString(36);
      this.assignees = []

      this.errors = {}
    });
  }
  

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
    this.changed = true
    if(event.target.name === "structure_id"){
      this.assignees = []
      this.loadEmployeeInStructure()
    }
    if(event.target.name === "structure_employee_id"){
      if (this.structure_employee_id == 0) {
        this.errors.structure_employee_id = "Нужно кого-то выбрать!"
        return;
      }
      const emp = this.employeeInStructure.find(x => x.id === this.structure_employee_id)
      this.assignees = [...this.assignees, emp]
      this.structure_employee_id = 0;
      this.addAssignePopup = false;
    }
  }

  // onAddAssigneeDoneClick = () => {
  //   if (this.structure_employee_id == 0) {
  //     this.errors.structure_employee_id = "Нужно кого-то выбрать!"
  //     return;
  //   }
  //   const emp = this.employeeInStructure.find(x => x.id === this.structure_employee_id)
  //   this.assignees = [...this.assignees, {
  //     id: (this.assignees.length + 1) * -1,
  //     application_subtask_id: this.id,
  //     employee_name: emp?.employee_name,
  //     structure_employee_id: emp?.id
  //   }]
  //   this.structure_employee_id = 0;
  //   this.addAssignePopup = false;
  // }
  onAddAssigneeCancelClick = () => {
    this.addAssignePopup = false
    this.structure_employee_id = 0
  }
  deleteAssign = (id: number) => {
    this.assignees = this.assignees.filter(x => x.id !== id)
  }
  onAddAssign = () => {
    this.addAssignePopup = true;
  }

  setStructureID(id: number) {
    subTaskStore.structure_id = id;
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      created_at: this.created_at === "" ? null : this.created_at,
      updated_at: this.updated_at === "" ? null : this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      structure_id: this.structure_id - 0 === 0 ? null : this.structure_id - 0,
      application_id: this.application_id - 0,
      task_template_id: this.task_template_id - 0 === 0 ? null : this.task_template_id - 0,
      comment: this.comment,
      name: this.name,
      is_required: this.is_required,
      order: this.order - 0,
      status_id: this.status_id - 0,
      type_id: this.type_id - 0 === 0 ? null : this.type_id - 0,
      progress: this.progress - 0,
      deadline: this.deadline,
      employee_in_structure_ids: this.assignees.map(x => x.id)
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
        response = await createapplication_task(data, this.FileName, this.File);
      } else {
        response = await updateapplication_task(data, this.FileName, this.File);
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

  changeAppliationId(id: number) {
    this.application_id = id
    this.loadAppication(id)
  }

  async doLoad(id: number) {

    //загрузка справочников
    this.loadtask_types();
    this.loadtask_statuses();
    this.loadorg_structures();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_task(id);
  }

  changeDeadline(date: Dayjs) {
    if (date) {
      this.deadline = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.deadline = null
    }
  }

  async changeStatus(status_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await changeTaskStatus(this.id, status_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status_id
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadapplication_task = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_task(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.created_at = response.data.created_at;
          this.updated_at = response.data.updated_at;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.structure_id = response.data.structure_id;
          this.application_id = response.data.application_id;
          this.application_number = response.data.application_number;
          this.task_template_id = response.data.task_template_id;
          this.comment = response.data.comment;
          this.name = response.data.name;
          this.is_required = response.data.is_required;
          this.order = response.data.order;
          this.status_id = response.data.status_id;
          this.type_id = response.data.type_id;
          this.progress = response.data.progress;
          this.deadline = response.data.task_deadline;
          this.setStructureID(response.data.structure_id)
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
      const response = await getEmployeeInStructureGroup(this.structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employeeInStructure = response.data
          this.assignees = response.data?.filter(x => x.post_code === "head_structure") ?? []
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


  loadworkflow_task_templates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.workflow_task_templates = response.data
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

  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  
  loadAppication = async (application_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_number = response.data.number
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
