import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getHistoryTablesByApplication } from "api/HistoryTable/useGetHistoryTables";
import dayjs, { Dayjs } from "dayjs";
import { getFormattedDateToDashboard } from "functions/date_functions";
import { getByApplicationId, getEmployees } from "api/Employee/useGetEmployees";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  ApplicationID = 0;
  employee_id = 0;
  date_start: Dayjs = null;
  date_end: Dayjs = null;

  Employees = []

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }
  
  changeApplications(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
  }

  doLoad(){
    this.loademployees()
    this.loadHistoryTables();
  }

  
  loademployees = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getByApplicationId(this.ApplicationID);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Employees = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearFilter(){
    this.employee_id = 0;
    this.date_start = null;
    this.date_end = null;
  }

  loadHistoryTables = async () => {
    const date_start = this.date_start?.isValid() ? getFormattedDateToDashboard(this.date_start) : ""
    const date_end = this.date_end?.isValid() ? getFormattedDateToDashboard(this.date_end) : ""
    try {
      MainStore.changeLoader(true);
      const response = await getHistoryTablesByApplication(this.ApplicationID, this.employee_id, date_start, date_end);
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

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
    });
  };
}

export default new NewStore();
