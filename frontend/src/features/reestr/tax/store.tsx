import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletereestr, getMyreestrs, setApplicationToReestr } from "api/reestr";
import { getreestrs } from "api/reestr";
import { MONTHS } from "constants/constant";
import dayjs from "dayjs";
import { getTaxReport } from "api/Application/useGetApplications";
import { getorg_structures } from "api/org_structure";

class NewStore {
  data = [];

  year = 0;
  month = 7;
  status = 1;
  structure_id = 0;


  months = MONTHS
  years = []
  statuses = [
    { id: 1, name: "Оперативная", code: "operative", },
    { id: 2, name: "Утвержденная", code: "done", }
  ]
  structures = []

  errors: { [key: string]: string } = {};


  text_sign = "";
  text_sign2 = "";


  constructor() {
    makeAutoObservable(this);
  }


  loadYears = () => {
    const now = dayjs();
    const year = now.year();
    let years = []

    for (let index = 0; index < 5; index++) {
      years.push({ name: year - index, id: year - index })
    }
    this.year = year;
    this.years = years
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }

  async doLoad() {
    this.loadYears()
    this.loadOtchetData()
  }


  async loadOtchetData() {
    try {
      const status_code = this.statuses.find(x => x.id == this.status)?.code
      MainStore.changeLoader(true);
      const response = await getTaxReport(this.year, this.month, status_code);
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

  clearStore() {
    runInAction(() => {
      this.data = [];
    });
  };
}

export default new NewStore();
