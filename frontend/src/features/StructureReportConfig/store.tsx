import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletereestr, getMyreestrs, setApplicationToReestr } from "api/reestr";
import { getstructure_report_configs } from "api/structure_report_config"
import { createstructure_report, createstructure_report_fromConfig } from "api/structure_report"
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

  reportConfig_id = 0;
  // language_id = 1;
  year = 2025;
  month = 1;
  errors: { [key: string]: string } = {};

  id_structure_report = 0;
  Templates: []

  // filterTypes = [
  //   {
  //     id: 1,
  //     name: "Месяц",
  //     code: "month",
  //   },
  //   {
  //     id: 2,
  //     name: "Квартал",
  //     code: "kvartal",
  //   },
  //   {
  //     id: 3,
  //     name: "Пол года",
  //     code: "halfYear",
  //   },
  //   {
  //     id: 4,
  //     name: "9 месяцев",
  //     code: "9month",
  //   },
  //   {
  //     id: 5,
  //     name: "Год",
  //     code: "year",
  //   },
  // ]

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
  // Templates = [{
  //   id: 30,
  //   name: "Отчет по всем отделам"
  // }]
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
    // if (event.target.name === "filter_type") {
    //   // this.filter_type_code = this.filterTypes.find(x => x.id == event.target.value)?.code
    // }
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

  async loadStructureTemplates() {

    //TODO Заменить на нормалььный запрос

    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report_configs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Templates = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  doLoad() {
    this.loadStructureTemplates()
    this.loadYears()
  }


  async createReport() {
    var data = {

      id: 0,
      // quarter: this.quarter - 0,
      structureId: 0,// TODO set real structure
      statusId: 1, //TODO set real status
      reportConfigId: this.reportConfig_id - 0,
      month: this.month - 0,
      year: this.year - 0,
      quarter: 0
    };

    // const { isValid, errors } = await validate(data);
    // if (!isValid) {
    //   this.errors = errors;
    //   MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    //   return;
    // }

    try {
      MainStore.changeLoader(true);
      let response;
      response = await createstructure_report_fromConfig(data);
      if (response.status === 201 || response.status === 200) {
        // onSaved(response);
        if (data.id === 0) {
          this.id_structure_report = response.data.id
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

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.reportConfig_id = 0
      this.year = 2025;
      this.month = 1;

    });
  };
}

export default new NewStore();
