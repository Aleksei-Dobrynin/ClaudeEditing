import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { getfaq_question } from "api/faq_question";
import { createfaq_question } from "api/faq_question";
import { updatefaq_question } from "api/faq_question";
import {
  getDashboardGetApplicationCountWeek, getDashboardGetApplicationCountHour,
  getDashboardGetCountApplciations,
  getDashboardGetCountObjects,
  getDashboardGetCountTasks,
  getDashboardGetCountUserApplications,
  getDashboardGetFinance,
  getDashboardGetPaymentFinance,
  getDashboardAppCount,
  getDashboardGetArchiveCount,
  getForFinanceInvoice, getloadApplicationsCategoryCount,
  getDashboardGetAppsByStatusAndStructure
} from "api/Dashboard";
import { getStructures } from "api/Structure/useGetStructures";
import { getDistricts } from "api/District/useGetDistricts";
import { getServices } from "api/Service/useGetServices";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getFormattedDateToDashboard } from "functions/date_functions";

// dictionaries


class NewStore {

  pieStatuses: string[] = []
  pieStatusCounts: number[] = []
  pie_date_start = dayjs().add(-1, 'month')
  pie_date_end = dayjs()
  pie_structure_id = 0;
  pie_selected_status = "";
  pieEmployees: string[] = []
  pieEmployeeAppCounts: number[] = []

  financeMonth: string[] = ['янв', 'фев', 'март',]
  financeCount: number[] = [1, 2, 3]
  paymentCount: number[] = [1, 2, 3]
  finance_date_start = dayjs().add(-4, 'month')
  finance_date_end = dayjs()
  finance_structure_id = 0;

  finance_paid_date_start = dayjs().add(-4, 'month')
  finance_paid_date_end = dayjs()

  appCountMonth: string[] = []
  appCountCount: number[] = []
  appCount_date_start = dayjs().add(-2, 'month')
  appCount_date_end = dayjs()
  appCount_service_id = 0;
  appCount_status_id = 0;

  financeInvoiceMonth: string[] = []
  financeInvoiceCount: number[] = []
  financeInvoice_date_start = dayjs().add(-2, 'month')
  financeInvoice_date_end = dayjs()

  taskCounts: number[] = [30, 40, 45]
  taskStatus: string[] = ["Выполнен", "Выполнен2", "Выполне3",]
  userApplicationsCounts: number[] = [30, 40, 45]
  userApplicationsStatus: string[] = ["Выполнен", "Выполнен2", "Выполне3",]
  task_date_start = dayjs().add(-1, 'month')
  task_date_end = dayjs()
  userApplications_date_start = dayjs().add(-1, 'month')
  userApplications_date_end = dayjs()
  task_structure_id = 0;

  objTags: string[] = ['fasd', 'bfbgf', 'bgf Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
    'United States', 'China', 'Germany']
  objCounts: number[] = [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  obj_district_id = 0;

  app_count_hour_appcount_date_start = dayjs().add(-1, 'month')
  app_count_hour_appcount_date_end = dayjs()
  app_count_hour_appCounts: number[] = []
  app_count_hour_appStatus: string[] = []

  app_count_week_count_date_start = dayjs().add(-1, 'month')
  app_count_week_count_date_end = dayjs()
  app_count_week_Counts: number[] = []
  app_count_week_Status: string[] = []

  archive_count_date_start = dayjs().add(-1, 'week')
  archive_count_date_end = dayjs().add(1, 'day')
  archive_Counts: number[] = []
  archive_Status: string[] = []

  ApplicationsCategoryCount: any[] = [];
  category_count_date_start = dayjs().add(-1, 'month')
  category_count_date_end = dayjs()
  category_count_district_id = 0;
  category_count_is_paid_id = 0;

  selected_count_structure_id = 0;
  selected_count_structure_name = '';

  selected_refusal_count_structure_id = 0;
  selected_refusal_count_structure_name = '';

  selected_late_count_structure_id = 0;
  selected_late_count_structure_name = '';


  Structures = []
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
  onClickApplicationDashboard(value: string) {
    this.pieStatuses = []
    this.pieStatusCounts = []
    this.pie_selected_status = value
    this.loadApplicationsDashboardNext()
  }

  changeFinance(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadFinanceDashboard()
    this.loadPaymentFinanceDashboard()
  }

  changeAppCount(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadAppCountDashboard()
  }

  changeFinanceInvoice(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadFinanceInvoice()
  }

  changeTasks(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadTasksDashboard()
  }

  changeuserApplicationss(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadUserApplicationsDashboard()
  }

  changeApplicationCountHour(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadApplicationCountHour()
  }

  changeApplicationCountWeek(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadApplicationCountWeek()
  }

  changeArchiveCountWeek(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadArchiveCountWeek()
  }


  changeObjects(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadObjectsDashboard()
  }

  async doLoad() {
    this.loadStructures();
    this.loadDistrics();
    this.loadAppStatuses();
    this.loadFinanceInvoice();
    this.loadServices();
    this.loadApplicationsDashboard();
    this.loadFinanceDashboard();
    this.loadPaymentFinanceDashboard();
    this.loadAppCountDashboard();
    this.loadTasksDashboard();
    this.loadUserApplicationsDashboard();
    this.loadObjectsDashboard();
    this.loadApplicationCountHour();
    this.loadApplicationCountWeek();
    this.loadArchiveCountWeek();
    this.loadApplicationsCategoryCount();
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

  loadFinanceDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetFinance(this.finance_date_start, this.finance_date_end?.add(1, 'day'), this.finance_structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.financeCount = response.data.counts
          this.financeMonth = response.data.names
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

  loadPaymentFinanceDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetPaymentFinance(this.finance_date_start, this.finance_date_end?.add(1, 'day'), this.finance_structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.paymentCount = response.data.counts
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


  loadAppCountDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardAppCount(this.appCount_date_start, this.appCount_date_end?.add(1, 'day'), this.appCount_service_id, this.appCount_status_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.appCountCount = response.data.counts
          this.appCountMonth = response.data.names
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
  loadFinanceInvoice = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getForFinanceInvoice(this.financeInvoice_date_start, this.financeInvoice_date_end?.add(1, 'day'));
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.financeInvoiceCount = response.data.counts
          this.financeInvoiceMonth = response.data.names
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
  loadTasksDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetCountTasks(this.task_date_start, this.task_date_end?.add(1, 'day'), this.task_structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.taskCounts = response.data.counts
          this.taskStatus = response.data.names
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

  loadUserApplicationsDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetCountUserApplications(this.task_date_start, this.task_date_end?.add(1, 'day'),);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.userApplicationsCounts = response.data.counts
          this.userApplicationsStatus = response.data.names
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

  loadApplicationCountHour = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetApplicationCountHour(this.app_count_hour_appcount_date_start, this.app_count_hour_appcount_date_end?.add(1, 'day'));
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.app_count_hour_appCounts = response.data.counts
          this.app_count_hour_appStatus = response.data.names
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
  loadApplicationCountWeek = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetApplicationCountWeek(this.app_count_week_count_date_start, this.app_count_week_count_date_end?.add(1, 'day'));
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.app_count_week_Counts = response.data.counts
          this.app_count_week_Status = response.data.names
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

  loadArchiveCountWeek = async () => {
    if (this.archive_count_date_start?.isValid() && this.archive_count_date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await getDashboardGetArchiveCount(getFormattedDateToDashboard(this.archive_count_date_start), getFormattedDateToDashboard(this.archive_count_date_end));
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            this.archive_Counts = response.data.counts
            this.archive_Status = response.data.names
          });
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    }else{
      this.archive_Counts = []
      this.archive_Status = []
    }
  };

  loadApplicationsCategoryCount = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getloadApplicationsCategoryCount(
        this.category_count_date_start,
        this.category_count_date_end?.add(1, 'day'),
        this.category_count_district_id,
        this.category_count_is_paid_id == 1 ? true : this.category_count_is_paid_id == 0 ? null : false);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.ApplicationsCategoryCount = response.data
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

  loadObjectsDashboard = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDashboardGetCountObjects(this.obj_district_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.objCounts = response.data.counts
          this.objTags = response.data.names
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



  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Structures = response.data
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
  loadDistrics = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Districts = response.data
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
  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Services = response.data
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
