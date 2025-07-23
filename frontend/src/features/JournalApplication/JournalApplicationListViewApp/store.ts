import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationPagination, getApplicationPaginationFinPlan } from "api/Application/useGetApplications";
import { deleteApplication } from "api/Application/useDeleteApplication";
import { GridSortModel } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { getServices } from "api/Service/useGetServices";
import { FilterApplication } from "constants/Application";
import { getDistricts } from "api/District/useGetDistricts";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getTags } from "api/Tag/useGetTags";
import { getEmployees, getRegisterEmployees } from "../../../api/Employee/useGetEmployees";
import appFilterStore from "../../ApplicationFilter/ApplicationFilterAddEditView/store";
import { getCheckApplicationBeforeRegistering, setApplicationToReestr } from "../../../api/reestr";
import { getDocumentJournalss } from "../../../api/DocumentJournals";

type N8nValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

class NewStore {
  data = [];
  Journals = [];
  openPanel = false;
  currentId = 0;
  totalCount = 0;
  is_allFilter = false;

  filter: FilterApplication = {
    pageSize: 100,
    pageNumber: 0,
    sort_by: null,
    sort_type: null,
    pin: "",
    customerName: "",
    date_start: null,
    date_end: null,
    service_ids: [],
    status_ids: [],
    address: "",
    number: "",
    district_id: null,
    deadline_day: 0,
    tag_id: null,
    isExpired: false,
    isMyOrgApplication: false,
    withoutAssignedEmployee: false,
    employee_id: 0,
    common_filter: "",
    useCommon: true,
    structure_ids: [],
    incoming_numbers: "",
    outgoing_numbers: "",
    only_count: false,
    is_paid: null,
    is_journal: null,
    journals_id: 0,
    // Новые поля для фильтрации по суммам
    total_sum_from: null,
    total_sum_to: null,
    total_payed_from: null,
    total_payed_to: null
  };
  checkResult: null | { valid: boolean; errors: Record<string, string> } = null;
  selectedApplicationId: number | null = null;
  errors: { [key: string]: string } = {};
  isFinPlan: boolean = false;
  openPanelFinPlan = false;
  applicationIdFinPlan = 0;

  Services = [];
  Statuses = [];
  Districts = [];
  DeadlineDays = [
    { id: 7, name: "7 дней" },
    { id: 3, name: "3 дней" },
    { id: 1, name: "1 дней" },
    { id: -1, name: "Сегодня" }
  ];
  Tags = [];
  Employees = [];

  selectedReestrId = 0;
  selectedReestrName = "";
  openReestrSelectPanel = false;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    // runInAction(() => {
    //   this.openPanel = true;
    //   this.currentId = id;
    //   this.page = 0;
    //   this.pageSize = 10;
    //   this.totalCount = 0;
    //   this.orderBy = null;
    //   this.orderType = null;
    //   this.searchText = "";
    // });
  }

  changeOpenPanel(flag: boolean, id: number) {
    runInAction(() => {
      this.openPanel = flag;
      this.currentId = id;
    });
  }

  onChangePanelFinPlan(flag: boolean, application_id: number) {
    this.openPanelFinPlan = flag;
    this.applicationIdFinPlan = application_id;
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.filter.pageNumber = page;
      this.filter.pageSize = pageSize;
    });
    this.loadApplications();
  };

  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.filter.sort_by = null;
        this.filter.sort_type = null;
      } else {
        this.filter.sort_by = sortModel[0].field;
        this.filter.sort_type = sortModel[0].sort;
      }
    });
    this.loadApplications();

  };

  clearFilter() {
    this.filter = {
      pageSize: 100,
      pageNumber: 0,
      sort_by: null,
      sort_type: null,
      pin: "",
      customerName: "",
      date_start: null,
      date_end: null,
      service_ids: [],
      status_ids: [],
      address: "",
      district_id: 0,
      journals_id: 0,
      deadline_day: 0,
      number: "",
      tag_id: 0,
      isExpired: false,
      isMyOrgApplication: false,
      withoutAssignedEmployee: false,
      employee_id: 0,
      useCommon: true,
      common_filter: "",
      structure_ids: [],
      incoming_numbers: "",
      outgoing_numbers: "",
      employee_arch_id: null,
      dashboard_date_start: null,
      dashboard_date_end: null,
      issued_employee_id: null,
      only_count: false,
      is_paid: null,
      // Очищаем новые поля
      total_sum_from: null,
      total_sum_to: null,
      total_payed_from: null,
      total_payed_to: null
    };
    this.is_allFilter = false;

  }

  doLoad(isFinPlan: boolean) {
    this.isFinPlan = isFinPlan;
    this.loadApplications();
    this.loadServices();
    this.loadStatuses();
    this.loadDistricts();
    this.loadTags();
    this.loadEmployees();
    this.loadDocumentJournalss();
  }

  changeAllFilter(event) {
    this.is_allFilter = event.target.value;
    if (this.filter) {
      this.filter.useCommon = !this.is_allFilter;
    }
  }

  changeService(ids: number[]) {
    this.filter.service_ids = ids;
  }

  changeStatus(ids: number[]) {
    this.filter.status_ids = ids;
  }

  changeDateStart(date: Dayjs) {
    if (date != null) {
      this.filter.date_start = date.startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      this.filter.date_start = null;
    }

  }

  changeDateEnd(date: Dayjs) {
    if (date != null) {
      this.filter.date_end = date.endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      this.filter.date_end = null;
    }

  }

  changePin = (pin: string) => {
    this.filter.pin = pin;
  };
  changeJournalId = (journals_id: number) => {
    this.filter.journals_id = journals_id;
  };
  changeCustomerName = (customerName: string) => {
    this.filter.customerName = customerName;
  };
  changeAddress = (address: string) => {
    this.filter.address = address;
  };
  changeCommonFilter = (common_filter: string) => {
    this.filter.common_filter = common_filter;
  };

  changeNumber = (number: string) => {
    this.filter.number = number;

  };
  changeDistrict = (id: number) => {
    this.filter.district_id = id;

  };
  changeDeadlineDay = (id: number) => {
    this.filter.deadline_day = id;

  };

  // Новые методы для фильтрации по суммам
  changeTotalSumFrom = (value: string) => {
    this.filter.total_sum_from = value ? parseFloat(value) : null;

  };

  changeTotalSumTo = (value: string) => {
    this.filter.total_sum_to = value ? parseFloat(value) : null;

  };

  changeTotalPayedFrom = (value: string) => {
    this.filter.total_payed_from = value ? parseFloat(value) : null;

  };

  changeTotalPayedTo = (value: string) => {
    this.filter.total_payed_to = value ? parseFloat(value) : null;

  };

  handleCheckboxChangeWithLoad = (fieldName: string, value: boolean, customHandler?: () => void) => {
    const prevValue = this.filter[fieldName];

    if (customHandler) {
      customHandler();
    } else {
      this.filter[fieldName] = value;
    }

    // Автоматически загружаем при снятии галочки (true -> false)
    if (prevValue === true && value === false) {
      this.loadApplications();
    }
  };

  changeIsPaid = (isPaid: boolean, autoLoad: boolean = false) => {
    const prevIsPaid = this.filter.is_paid === isPaid;

    if (this.filter.is_paid == isPaid) {
      this.filter.is_paid = null;
      // Автоматически загружаем при снятии галочки
      this.loadApplications();
    } else {
      this.filter.is_paid = isPaid;
    }
  };

  changeTag = (id: number) => {
    this.filter.tag_id = id;

  };

  changeEmployee = (id: number) => {
    this.filter.employee_id = id;

  };
  changeIncomingNumbers = (incoming_numbers: string) => {
    this.filter.incoming_numbers = incoming_numbers;

  };

  changeOutgoingNumbers = (outgoing_numbers: string) => {
    this.filter.outgoing_numbers = outgoing_numbers;

  };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Services = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Statuses = response.data;
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
      MainStore.changeLoader(true);
      const response = await getRegisterEmployees();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Employees = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplications = async () => {
    try {
      MainStore.changeLoader(true);
      this.filter.is_journal = true;
      const response = this.isFinPlan ? await getApplicationPaginationFinPlan(this.filter) : await getApplicationPagination(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data.items;
        this.totalCount = response.data.totalCount;
      } else {
        if (response?.response?.status === 400) {
          this.clearFilter();
          await this.loadApplications();
          return;
        }
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  saveFilter = async () => {
    appFilterStore.onSaveFilter(JSON.stringify(toJS(this.filter)));
    appFilterStore.openPanel = false;
  };

  closeFilter = async () => {
    appFilterStore.openPanel = false;
  };

  loadDocumentJournalss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDocumentJournalss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Journals = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Districts = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  loadTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Tags = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteApplication = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteApplication(id);
          if (response.status === 201 || response.status === 200) {
            this.loadApplications();
            MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
          } else {
            throw new Error();
          }
        } catch (err) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
  };

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.openPanelFinPlan = false;
      this.applicationIdFinPlan = 0;
      this.selectedReestrId = 0;
      this.selectedReestrName = "";
      this.openReestrSelectPanel = false;
    });
  };

  onChangeReestrSelectPanel(flag: boolean) {
    this.openReestrSelectPanel = flag;
  }

  async setApplicationToReestr(applicationId: number, reestrId: number, reestrName: string) {
    try {
      MainStore.changeLoader(true);
      const response = await setApplicationToReestr(applicationId, reestrId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        let index = this.data.findIndex(item => item.id === applicationId);
        if (index >= 0) {
          runInAction(() => {
            let newArray = this.data.map(item =>
              item.id === applicationId ? { ...item, reestr_id: reestrId, reestr_name: reestrName } : item
            );
            this.data = JSON.parse(JSON.stringify(newArray)); //Array.from(newArray); //[...newArray];
          });
        }
        // this.loadApplications();
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async getCheckApplicationBeforeRegistering(applicationId: number, reestrId: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getCheckApplicationBeforeRegistering(applicationId, reestrId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const result = response.data;
        return result;
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  setCheckResult(result: N8nValidationResult, applicationId?: number) {
    this.checkResult = result;
    this.selectedApplicationId = applicationId;
  }

  setSelectedApplicationId(id: number) {
    this.selectedApplicationId = id;
  }
}

export default new NewStore();