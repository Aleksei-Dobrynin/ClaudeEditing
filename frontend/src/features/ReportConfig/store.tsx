import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletereestr, getMyreestrs, setApplicationToReestr } from "api/reestr";
import { getreestrs } from "api/reestr";
import dayjs from "dayjs";
import { MONTHS } from "constants/constant";
import { getFilledReport, getFilledTemplate } from "api/org_structure";
import printJS from "print-js";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;

  template_id = 30;
  language_id = 1;
  year = 2025;
  filter_type = 1;
  filter_type_code = "month";
  month = 1;
  kvartal = 1;
  polgoda = 1;
  errors: { [key: string]: string } = {};

  filterTypes = [
    {
      id: 1,
      name: "Месяц",
      code: "month",
    },
    {
      id: 2,
      name: "Квартал",
      code: "kvartal",
    },
    {
      id: 3,
      name: "Пол года",
      code: "halfYear",
    },
    {
      id: 4,
      name: "9 месяцев",
      code: "9month",
    },
    {
      id: 5,
      name: "Год",
      code: "year",
    },
  ]

  months = MONTHS
  kvartals = [
    { id: 1, name: "Первый квартал" },
    { id: 2, name: "Второй квартал" },
    { id: 3, name: "Третий квартал" },
    { id: 4, name: "Четвертый квартал" },
  ]
  polGods = [
    { id: 1, name: "Первое полугодие" },
    { id: 2, name: "Второе полугодие" },
  ]
  Templates = [{
    id: 30,
    name: "Отчет по всем отделам"
  }]
  Languages = [{
    id: 1,
    name: "Русский",
    code: "ru"
  }, {
    id: 2,
    name: "Кыргызча",
    code: "ky"
  }]
  years = []


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

  constructor() {
    makeAutoObservable(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    if (event.target.name === "filter_type") {
      this.filter_type_code = this.filterTypes.find(x => x.id == event.target.value)?.code
    }
  }

  async loadreestrs() {
    try {
      MainStore.changeLoader(true);
      const response = await getMyreestrs();
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

  doLoad() {
    this.loadYears()
  }

  async printDocument() {
    const language = this.Languages.find(x => x.id == this.language_id)?.code;
    try {
      MainStore.changeLoader(true);
      const response = await getFilledReport(this.template_id, language, this.year, this.filter_type_code, this.month, this.kvartal, this.polgoda);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: 'raw-html',
          targetStyles: ['*']
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;

      this.template_id = 30;
      this.language_id = 1;
      this.year = 2025;
      this.filter_type = 1;
      this.filter_type_code = "month";
      this.month = 1;
      this.kvartal = 1;
      this.polgoda = 1;
    });
  };
}

export default new NewStore();
