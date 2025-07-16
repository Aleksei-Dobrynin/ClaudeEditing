import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getlegal_act_registry } from "api/legal_act_registry";
import { createlegal_act_registry } from "api/legal_act_registry";
import { updatelegal_act_registry } from "api/legal_act_registry";

// dictionaries

import { getlegal_act_registry_statuses } from "api/legal_act_registry_status";
import { getorg_structures } from "api/org_structure";
import { getEmployeeInStructureGroup } from "api/EmployeeInStructure/useGetEmployeeInStructure";
import { getlegal_registry_statuses } from "api/legal_registry_status";
import { getlegal_objects } from "api/legal_object";
// import { getlegal_act_registry_statuses } from "api/legal_act_registry_status";

// import { getlegal_registry_statuses } from "api/legal_registry_status";

class NewStore {
  id = 0;
  is_active = false;
  act_type = "";
  date_issue = null;
  id_status = 0;
  subject = "";
  act_number = "";
  decision = "";
  addition = "";
  created_at = null;
  updated_at = null;
  created_by = 0;
  updated_by = 0;
  LegalObjects = [];
  id_LegalObjects: number[] = [];
  errors: { [key: string]: string } = {};

  // Справочники
  legal_act_registry_statuses = [];
  legal_registry_statuses = [];
  org_structures = [];
  // New properties for assignees
  addAssignePopup = false;
  addAddresPopup = false;
  structure_employee_id = 0;
  employeeInStructure = [];
  assignees = [];
  assigneesIds = []
  structure_id = 215;  //TODO Отдел правового обеспечения 

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.is_active = false;
      this.act_type = "";
      this.date_issue = null;
      this.id_status = 0;
      this.subject = "";
      this.act_number = "";
      this.decision = "";
      this.addition = "";
      this.created_at = null;
      this.updated_at = null;
      this.created_by = 0;
      this.updated_by = 0;
      this.id_LegalObjects = [];
      this.errors = {};
      // Clear new properties
      this.addAssignePopup = false;
      this.addAddresPopup = false;
      this.structure_employee_id = 0;
      this.employeeInStructure = [];
      this.assignees = [];
      this.assigneesIds = []
    });
  }

  changeLegalObjects(ids: number[]) {
    this.id_LegalObjects = ids;
  }
  setStructureID(id: number) {
    this.structure_id = id;
  }

  loadLegalObjects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_objects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.LegalObjects = response.data;
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

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
    //new logic
    if (event.target.name === "structure_id") {
      this.assignees = [];
      this.loadEmployeeInStructure();
    }
    if (event.target.name === "structure_employee_id") {
      if (this.structure_employee_id == 0) {
        this.errors.structure_employee_id = "Нужно кого-то выбрать!";
        return;
      }
      const emp = this.employeeInStructure.find(
        (x) => x.id === this.structure_employee_id
      );
      this.assignees = [...this.assignees, emp];
      this.structure_employee_id = 0;
      this.addAssignePopup = false;
    }
  }
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

  changeAddresPopup = (bool: boolean) => {
    this.addAddresPopup = bool;
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
      is_active: this.is_active,
      act_type: this.act_type,
      date_issue: this.date_issue,
      id_status: this.id_status - 0,
      subject: this.subject,
      act_number: this.act_number,
      decision: this.decision,
      addition: this.addition,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      legalObjects: this.id_LegalObjects,
      assignees: this.assignees.map(x => x.id)
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
        response = await createlegal_act_registry(data);
      } else {
        response = await updatelegal_act_registry(data);
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
    //загрузка справочников
    await this.loadlegal_act_registry_statuses();
    await this.loadlegal_registry_statuses();
    // await this.loadlegal_act_registry_statuses();
    // await this.loadlegal_registry_statuses();
    await this.loadLegalObjects();
    await this.loadEmployeeInStructure();
    await this.loadorg_structures();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    await this.loadlegal_act_registry(id);
  }

  loadlegal_act_registry = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registry(id);
      if (
        (response.status === 201 || response.status === 200) &&
        response?.data !== null
      ) {
        runInAction(() => {
          this.id = response.data.id;
          this.is_active = response.data.is_active;
          this.act_type = response.data.act_type;
          this.date_issue = dayjs(response.data.date_issue);
          this.id_status = response.data.id_status;
          this.subject = response.data.subject;
          this.act_number = response.data.act_number;
          this.decision = response.data.decision;
          this.addition = response.data.addition;
          // this.created_at = dayjs(response.data.created_at);
          // this.updated_at = dayjs(response.data.updated_at);
          // this.created_by = response.data.created_by;
          // this.updated_by = response.data.updated_by;
          this.id_LegalObjects = response.data.legalObjects;
          // this.assignees = this.employeeInStructure.filter(x => response.data.assignees.includes(x.id));
          this.assigneesIds = response.data.assignees;
          this.assignees = this.employeeInStructure.filter(x => response.data.assignees.includes(x.id));
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
      if (
        (response.status === 201 || response.status === 200) &&
        response?.data !== null
      ) {
        runInAction(() => {
          this.employeeInStructure = response.data;
          this.assignees = response.data.filter(x => this.assigneesIds.includes(x.id));
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

  loadlegal_act_registry_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registry_statuses();
      if (
        (response.status === 201 || response.status === 200) &&
        response?.data !== null
      ) {
        this.legal_act_registry_statuses = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadlegal_registry_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_registry_statuses();
      if (
        (response.status === 201 || response.status === 200) &&
        response?.data !== null
      ) {
        this.legal_registry_statuses = response.data;
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
      if (
        (response.status === 201 || response.status === 200) &&
        response?.data !== null
      ) {
        this.org_structures = response.data;
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
