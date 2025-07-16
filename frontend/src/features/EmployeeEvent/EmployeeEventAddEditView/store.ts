import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getEmployeeEvent } from "api/EmployeeEvent/useGetEmployeeEvent";
import { createEmployeeEvent } from "api/EmployeeEvent/useCreateEmployeeEvent";
import { updateEmployeeEvent } from "api/EmployeeEvent/useUpdateEmployeeEvent";
import { getHrmsEventTypes } from "api/HrmsEventType/useGetHrmsEventTypes";
import { getEmployees } from "api/Employee/useGetEmployees";
import { checkIsHeadStructure } from "api/EmployeeInStructure/useGetEmployeeInStructure";

class NewStore {
  id = 0;
  date_start = null;
  date_end = null;
  event_type_id = 0;
  employee_id = 0;
  errordate_start = "";
  errordate_end = "";
  errorevent_type_id = "";
  erroremployee_id = "";

  HrmsEventType = [];

  is_head_structure = false;
  need_temporary = false;
  temporary_employee_id = 0;
  errortemporary_employee_id = "";
  Employees = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.date_start = null;
      this.date_end = null;
      this.event_type_id = 0;
      this.employee_id = 0;
      this.errordate_start = "";
      this.errordate_end = "";
      this.errorevent_type_id = "";
      this.erroremployee_id = "";
      this.HrmsEventType = [];
      this.need_temporary = false;
      this.temporary_employee_id = 0;
      this.errortemporary_employee_id = "";
      this.is_head_structure = false;
      this.Employees = [];
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
    if (event.target.name === "need_temporary") {
      if (event.target.value) {
        this.loadEmployees();
      } else {
        this.handleChange({ target: { value: 0, name: "temporary_employee_id" } });
      }
    }
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          date_start: this.date_start,
          date_end: this.date_end,
          event_type_id: this.event_type_id,
          employee_id: this.employee_id,
          temporary_employee_id: this.need_temporary ? this.temporary_employee_id : null,
        };

        const response =
          data.id === 0 ? await createEmployeeEvent(data) : await updateEmployeeEvent(data);

        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
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
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  loadEmployeeEvent = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeEvent(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.date_start = response.data.date_start;
          this.date_end = response.data.date_end;
          this.event_type_id = response.data.event_type_id;
          this.employee_id = response.data.employee_id;
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

  loadHrmsEventTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getHrmsEventTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.HrmsEventType = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  checkIsHeadStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await checkIsHeadStructure(this.employee_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.is_head_structure = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEmployees = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployees();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Employees = response.data.filter(x => x.id !== this.employee_id);
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
    this.loadHrmsEventTypes();
    this.checkIsHeadStructure();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadEmployeeEvent(id);
  }
}

export default new NewStore();
