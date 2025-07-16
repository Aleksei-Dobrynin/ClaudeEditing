import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getDutyPlanLogs, getDutyPlanLogsByFilter } from "api/DutyPlanLog/useGetDutyPlanLogs";
import { getEmployees } from "../../../api/Employee/useGetEmployees";

class NewStore {
  data = [];
  employees = [];
  DutyPlanLogStatuses = [];
  filter = {
    doc_number: '',
    employee_id: 0
  };
  openPanel = false;
  openReturnPanel = false;
  currentId = 0;
  

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  clearFilter() {
    this.filter = {
      doc_number: '',
      employee_id: 0
    };
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  onOpenReturnPanel(id: number) {
    runInAction(() => {
      this.openReturnPanel = true;
      this.currentId = id;
    });
  }

  onCloseReturnPanel() {
    runInAction(() => {
      this.openReturnPanel = false;
      this.currentId = 0;
    });
  }

  loadDutyPlanLogs = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDutyPlanLogs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDutyPlanLogsByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDutyPlanLogsByFilter(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
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
      const response = await getEmployees();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.employees = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.filter = null;
    });
  };
}

export default new NewStore();
