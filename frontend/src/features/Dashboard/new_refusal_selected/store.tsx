import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import {
  getDashboardGetRefucalCountBySelectedStructure
} from "api/Dashboard";
import { getFormattedDateToDashboard } from "functions/date_functions";
import dashboardStore from 'features/Dashboard/store'


class NewStore {

  date_start = dayjs().add(-1, 'month').startOf('day')
  date_end = dayjs().endOf('day')
  data = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
  }


  changeArchiveCountWeek(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadIssuedAppsRegister()
  }


  async doLoad() {
    this.loadIssuedAppsRegister();
  }

  loadIssuedAppsRegister = async () => {
    if (dashboardStore.selected_refusal_count_structure_id == 0) return;
    if (this.date_start?.isValid() && this.date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await getDashboardGetRefucalCountBySelectedStructure(getFormattedDateToDashboard(this.date_start), getFormattedDateToDashboard(this.date_end), dashboardStore.selected_refusal_count_structure_id);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            const total = response.data.map(x => x.count).reduce((sum, num) => sum + num, 0);
            response.data.forEach(s => {
              s.percentage = Math.round((s.count / total) * 100)
            })
            this.data = response.data
          });
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      this.data = []
    }
  };



}

export default new NewStore();
