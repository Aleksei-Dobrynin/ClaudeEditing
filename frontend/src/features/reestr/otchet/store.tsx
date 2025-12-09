import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletereestr, getMyreestrs, setApplicationToReestr } from "api/reestr";
import { getreestrs } from "api/reestr";
import { MONTHS } from "constants/constant";
import dayjs from "dayjs";
import { getApplicationForReestrOtchet } from "api/Application/useGetApplications";
import { getorg_structures } from "api/org_structure";

class NewStore {
  fiz_lico = [];
  your_lico = [];

  year = 0;
  month = 8;
  status = 1;
  structure_id = 0;
  rowClickedId = 0;


  months = MONTHS
  years = []
  statuses = [
    { id: 1, name: "Оперативная", code: "operative", },
    { id: 2, name: "Утвержденная", code: "done", }
  ]
  structures = []

  errors: { [key: string]: string } = {};


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
    this.loadStructures()
  }

  clickRow(id: number) {
    this.rowClickedId = id
  }
  
  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
       // this.structures = response.data;
        this.structures = response.data.filter(x => x.order_number != null).sort((a, b) => a.order_number - b.order_number);
       
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }


  async loadOtchetData() {
    try {
      const status_code = this.statuses.find(x => x.id == this.status)?.code
      MainStore.changeLoader(true);
      const response = await getApplicationForReestrOtchet(this.year, this.month, status_code, this.structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fiz_lico = response.data?.fiz_lico;
        this.your_lico = response.data?.your_lico;
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
      this.fiz_lico = [];
      this.your_lico = [];
      this.rowClickedId = 0;
    });
  };
}

export default new NewStore();
