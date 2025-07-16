import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import {
  getDashboardGetCountLateByStructure
} from "api/Dashboard";
import { getFormattedDateToDashboard } from "functions/date_functions";



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
    if (this.date_start?.isValid() && this.date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await getDashboardGetCountLateByStructure(getFormattedDateToDashboard(this.date_start), getFormattedDateToDashboard(this.date_end));
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
