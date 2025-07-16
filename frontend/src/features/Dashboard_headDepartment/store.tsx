import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import {
  getDashboardGetApplicationCountWeek, getDashboardGetApplicationCountHour,
  getDashboardGetCountApplciations,
  getDashboardGetCountObjects,
  getDashboardGetCountTasks,
  getDashboardGetCountUserApplications,
  getDashboardGetFinance,
  getDashboardAppCount,
  getDashboardGetArchiveCount,
  getForFinanceInvoice, getloadApplicationsCategoryCount,
  getDashboardGetAppsByStatusAndStructure,
  getAppCountDashboardByStructure,
  dashboardGetEmployeeCalculations,
  dashboardGetEmployeeCalculationsGrouped,
  dashboardGetEmployeeCalculationsExcel,
  dashboardGetEmployeeCalculationsGroupedExcel,
} from "api/Dashboard";
import { getStructures } from "api/Structure/useGetStructures";
import { getDistricts } from "api/District/useGetDistricts";
import { getServices } from "api/Service/useGetServices";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getDashboardInfo } from 'api/Employee/useGetEmployeeByEmail';
import { getFormattedDateToDashboard } from "functions/date_functions";
import PivotStore from './pivot/store'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import printJS from "print-js";
import { getMyStructureReports, getS_DocumentTemplatesByType } from "api/S_DocumentTemplate";
import { getFilledTemplate } from "api/org_structure";

// dictionaries


class NewStore {

  pieStatuses: string[] = []
  pieStatusCounts: number[] = []
  pie_date_start = dayjs().add(-1, 'month')
  pie_date_end = dayjs().add(1, 'day')
  pie_structure_id = 0;
  pie_selected_status = "";
  pieEmployees: string[] = []
  pieEmployeeAppCounts: number[] = []

  app_count_date_start = dayjs().add(-1, 'month')
  app_count_date_end = dayjs().add(1, 'day')
  app_count_structure_id = 0;
  app_count_data = []

  calculation_date_start = dayjs().add(-1, 'month')
  calculation_date_end = dayjs().add(1, 'day')
  calculation_structure_id = 0;
  calculation_order_id = 1;
  calculation_data = []
  calculation_order_data = [
    { id: 1, name: "Исполнитель", code: "employee" }, { id: 2, name: "Время регистрации", code: "registration_date" }
  ]

  calculation_grouped_date_start = dayjs().add(-1, 'month')
  calculation_grouped_date_end = dayjs().add(1, 'day')
  calculation_grouped_structure_id = 0;
  calculation_grouped_data = []

  reports_report_id = 0;
  reports_date_start = dayjs().add(-1, 'month')
  reports_date_end = dayjs().add(1, 'day')
  report_html = ""
  report_editor_panel = false;

  Structures = [];
  Reports = [];
  Services = []
  AppStatuses = []
  Districts = []

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

  changeApplications(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    if (this.pie_selected_status === "") {
      this.loadApplicationsDashboard()
    } else {
      this.loadApplicationsDashboardNext()
    }
  }

  changeAppCount(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadDashboardAppCount();
  }

  changeEmployeeCalculations(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.getDashboardEmployeeCalculations();
  }

  changeEmployeeCalculationsGrouped(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.getDashboardEmployeeCalculationsGrouped();
  }

  onClickApplicationDashboard(value: string) {
    this.pieStatuses = []
    this.pieStatusCounts = []
    this.pie_selected_status = value
    this.loadApplicationsDashboardNext()
  }


  async doLoad() {
    this.loadDashboardForInfo();
    this.loadAppStatuses();
    this.getReports();
  }


  async loadDashboardForInfo() {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardInfo();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Structures = response.data.dashboard_head_of_structures;
          this.Services = response.data.dashboard_services;
          this.app_count_structure_id = response.data.dashboard_head_of_structures[0]?.id ?? 0
          this.pie_structure_id = response.data.dashboard_head_of_structures[0]?.id ?? 0
          this.calculation_structure_id = response.data.dashboard_head_of_structures[0]?.id ?? 0
          this.calculation_grouped_structure_id = response.data.dashboard_head_of_structures[0]?.id ?? 0
          PivotStore.service_id = response.data.dashboard_services[0]?.id
        });
        this.loadDashboardAppCount()
        this.loadApplicationsDashboard()
        this.getDashboardEmployeeCalculations()
        this.getDashboardEmployeeCalculationsGrouped()
        PivotStore.loadApplications()
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  printCalculation() {
    if (this.calculation_structure_id != 0 && this.calculation_date_start?.isValid() && this.calculation_date_end?.isValid()) {
      const order = this.calculation_order_data.find(x => x.id == this.calculation_order_id)?.code ?? "employee"
      MainStore.printDocumentByCode("report_calculation_otdel", {
        structure_id: this.calculation_structure_id,
        date_start: this.calculation_date_start,
        date_end: this.calculation_date_end,
        sort_column: order
      })
    }
  }

  printCalculationGrouped() {
    if (this.calculation_grouped_structure_id != 0 && this.calculation_grouped_date_start?.isValid() && this.calculation_grouped_date_end?.isValid()) {
      MainStore.printDocumentByCode("report_calculation_otdel_grouped", {
        structure_id: this.calculation_grouped_structure_id,
        date_start: this.calculation_grouped_date_start,
        date_end: this.calculation_grouped_date_end
      })
    }
  }

  printExcel() {
    const modifiedData = this.app_count_data.map(({ ...rest }) => ({
      'Все заявки': rest.all_count,
      'В работе': rest.at_work_count,
      'Реализовано': rest.done_count,
      'Принято (по техсовету)': rest.tech_accepted_count,
      'Отказ (по техсовету)': rest.tech_declined_count,
    }));
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Отчет по заявкам.xlsx`);
  }

  printPdf() {
    if (this.app_count_date_start?.isValid() && this.app_count_date_end?.isValid() && this.app_count_structure_id != 0 && this.app_count_data.length !== 0) {
      const structure_name = this.Structures.find(x => x.id == this.app_count_structure_id)?.structure_name
      printJS({
        printable: `
          <style>
          table {
          width: 100%;
          border-collapse: collapse;
          }
          th, td {
          border: 1px solid black;
          text-align: center;
          padding: 5px;
          }
          </style>

          <h3>Заявки отдела ${structure_name} за период - ${getFormattedDateToDashboard(this.app_count_date_start)} - ${getFormattedDateToDashboard(this.app_count_date_end)}</h3>


          <table>
          <tr>
          <th>Все заявки</th>
          <th>В работе</th>
          <th>Реализовано</th>
          <th>Принято (по техсовету)</th>
          <th>Отказ (по техсовету)</th>
          </tr>
          <tr>
          <td>${this.app_count_data[0].all_count}</td>
          <td>${this.app_count_data[0].at_work_count}</td>
          <td>${this.app_count_data[0].done_count}</td>
          <td>${this.app_count_data[0].tech_accepted_count}</td>
          <td>${this.app_count_data[0].tech_declined_count}</td>
          </tr>
          </table>
        `,
        type: 'raw-html',
        targetStyles: ['*']
      });
    }
  }

  async loadDashboardAppCount() {
    if (this.app_count_structure_id == 0 || !this.app_count_structure_id) {
      this.app_count_data = []
      return
    }
    if (this.app_count_date_start?.isValid() && this.app_count_date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await getAppCountDashboardByStructure(
          getFormattedDateToDashboard(this.app_count_date_start),
          getFormattedDateToDashboard(this.app_count_date_end),
          this.app_count_structure_id
        );
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            response.data.id = 1
            this.app_count_data = [response.data]
          });
        } else {
          throw new Error('Failed to load data');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      this.app_count_data = []
    }
  }

  loadApplicationsDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetCountApplciations(this.pie_date_start, this.pie_date_end?.add(1, 'day'), this.pie_structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.pieStatuses = response.data.names
          this.pieStatusCounts = response.data.counts
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

  getDashboardEmployeeCalculations = async () => {
    if (this.calculation_structure_id != 0 && this.calculation_date_start?.isValid() && this.calculation_date_end?.isValid()) {
      const order = this.calculation_order_data.find(x => x.id == this.calculation_order_id)?.code ?? "employee"
      try {
        MainStore.changeLoader(true);
        const response = await dashboardGetEmployeeCalculations(
          this.calculation_structure_id,
          getFormattedDateToDashboard(this.calculation_date_start),
          getFormattedDateToDashboard(this.calculation_date_end),
          order);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            this.calculation_data = response.data;
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
      this.calculation_data = [];
    }
  };

  getReports = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyStructureReports();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Reports = response.data;
          this.reports_report_id = response.data[0]?.id
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

  onChangePanel(flag: boolean) {
    this.report_editor_panel = flag
    if(!flag){
      this.report_html = ""
    }
  }

  printDocument = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplate(this.reports_report_id, "ru", { "dateStart": this.reports_date_start, "dateEnd": this.reports_date_end });
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // printJS({
        //   printable: response.data,
        //   type: "raw-html",
        //   targetStyles: ["*"],
        // });
        this.report_html = response.data
        this.onChangePanel(true)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  getDashboardEmployeeCalculationsExcel = async () => {
    if (this.calculation_structure_id != 0 && this.calculation_date_start?.isValid() && this.calculation_date_end?.isValid()) {
      const order = this.calculation_order_data.find(x => x.id == this.calculation_order_id)?.code ?? "employee"
      try {
        MainStore.changeLoader(true);
        const response = await dashboardGetEmployeeCalculationsExcel(
          this.calculation_structure_id,
          getFormattedDateToDashboard(this.calculation_date_start),
          getFormattedDateToDashboard(this.calculation_date_end),
          order);
        this.toExcelFile(response, "Калькуляции по сотрудникам.xlsx")
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      this.calculation_data = [];
    }
  };

  getDashboardEmployeeCalculationsGroupedExcel = async () => {
    if (this.calculation_grouped_structure_id != 0 && this.calculation_grouped_date_start?.isValid() && this.calculation_grouped_date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await dashboardGetEmployeeCalculationsGroupedExcel(
          this.calculation_structure_id,
          getFormattedDateToDashboard(this.calculation_date_start),
          getFormattedDateToDashboard(this.calculation_date_end));
        this.toExcelFile(response, "Калькуляции по сотрудникам.xlsx")
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      this.calculation_data = [];
    }
  };

  toExcelFile(file: any, fileName: string) {
    const blob = new Blob([file], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getDashboardEmployeeCalculationsGrouped = async () => {
    if (this.calculation_grouped_structure_id != 0 && this.calculation_grouped_date_start?.isValid() && this.calculation_grouped_date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await dashboardGetEmployeeCalculationsGrouped(
          this.calculation_grouped_structure_id,
          getFormattedDateToDashboard(this.calculation_grouped_date_start),
          getFormattedDateToDashboard(this.calculation_grouped_date_end));
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            this.calculation_grouped_data = response.data;
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
      this.calculation_grouped_data = [];
    }
  };

  loadApplicationsDashboardNext = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetAppsByStatusAndStructure(this.pie_date_start, this.pie_date_end?.add(1, 'day'), this.pie_structure_id, this.pie_selected_status);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.pieEmployees = response.data.names
          this.pieEmployeeAppCounts = response.data.counts
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


  loadAppStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.AppStatuses = response.data
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


}

export default new NewStore();
