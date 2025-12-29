import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationsPaginationRefusal } from "api/Application/useGetApplications";
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
import { addToFavorite, deleteToFavorite } from "../../../api/Application/useGetApplication";

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
  titleError = "";
  messageError = "";
  openError = false;

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
    // Новые поля для фильтрации по суммам
    total_sum_from: null,
    total_sum_to: null,
    total_payed_from: null,
    total_payed_to: null,
    tunduk_district_id: null,
    tunduk_address_unit_id: null,
    tunduk_street_id: null,
    app_ids: [],

  };
  checkResult: null | { valid: boolean; errors: Record<string, string> } = null;
  selectedApplicationId: number | null = null;
  errors: { [key: string]: string } = {};
  isFinPlan: boolean = false;
  isJournal: boolean = false;
  openPanelFinPlan = false;
  applicationIdFinPlan = 0;

  Services = [];
  Statuses = [];
  Districts = [];
  DeadlineDays = [
    { id: 7, name: "7 дней" },
    { id: 3, name: "3 дней" },
    { id: 1, name: "1 дней" },
    { id: -1, name: "Сегодня" },
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
    this.applicationIdFinPlan = application_id
  }

  changePagination = (page: number, pageSize: number) => {
    this.filter.pageNumber = page;
    this.filter.pageSize = pageSize;
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
      total_payed_to: null,
      tunduk_district_id: null,
      tunduk_address_unit_id: null,
      tunduk_street_id: null,
    };
    this.is_allFilter = false;
    this.setFilterToLocalStorage();
  }

  doLoad(isFinPlan: boolean, isJournal?: boolean) {
    if (isJournal == null) {
      let selectedReestrId = localStorage.getItem("selectedReestrId") ?? "0";
      let selectedReestrName = localStorage.getItem("selectedReestrName") ?? "";

      this.selectedReestrId = parseInt(selectedReestrId);
      this.selectedReestrName = selectedReestrName;
    }

    this.isFinPlan = isFinPlan
    this.isJournal = isJournal
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
    this.setFilterToLocalStorage();
  }

  changeService(ids: number[]) {
    this.filter.service_ids = ids;
    this.setFilterToLocalStorage();
  }
  changeStatus(ids: number[]) {
    this.filter.status_ids = ids;
    this.setFilterToLocalStorage();
  }
  changeDateStart(date: Dayjs) {
    if (date != null) {
      this.filter.date_start = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.filter.date_start = null
    }
    this.setFilterToLocalStorage();
  }
  changeDateEnd(date: Dayjs) {
    if (date != null) {
      this.filter.date_end = date.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.filter.date_end = null
    }
    this.setFilterToLocalStorage();
  }
  changePin = (pin: string) => {
    this.filter.pin = pin;
    this.setFilterToLocalStorage();
  };
  changeJournalId = (journals_id: number) => {
    this.filter.journals_id = journals_id;
  };
  changeCustomerName = (customerName: string) => {
    this.filter.customerName = customerName;
    this.setFilterToLocalStorage();
  };
  changeAddress = (address: string) => {
    this.filter.address = address;
    this.setFilterToLocalStorage();
  };
  changeCommonFilter = (common_filter: string) => {
    this.filter.common_filter = common_filter;
    this.setFilterToLocalStorage();
  };

  changeNumber = (number: string) => {
    this.filter.number = number;
    this.setFilterToLocalStorage();
  };
  changeDistrict = (id: number) => {
    this.filter.district_id = id;
    this.setFilterToLocalStorage();
  };
  changeDeadlineDay = (id: number) => {
    this.filter.deadline_day = id;
    this.setFilterToLocalStorage();
  };

  // Новые методы для фильтрации по суммам
  changeTotalSumFrom = (value: string) => {
    this.filter.total_sum_from = value ? parseFloat(value) : null;
    this.setFilterToLocalStorage();
  };

  changeTotalSumTo = (value: string) => {
    this.filter.total_sum_to = value ? parseFloat(value) : null;
    this.setFilterToLocalStorage();
  };

  changeTotalPayedFrom = (value: string) => {
    this.filter.total_payed_from = value ? parseFloat(value) : null;
    this.setFilterToLocalStorage();
  };

  changeTotalPayedTo = (value: string) => {
    this.filter.total_payed_to = value ? parseFloat(value) : null;
    this.setFilterToLocalStorage();
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

    if (fieldName !== 'is_paid') {
      this.setFilterToLocalStorage();
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
    this.setFilterToLocalStorage();
  };

  changeEmployee = (id: number) => {
    this.filter.employee_id = id;
    this.setFilterToLocalStorage();
  };
  changeIncomingNumbers = (incoming_numbers: string) => {
    this.filter.incoming_numbers = incoming_numbers;
    this.setFilterToLocalStorage();
  };

  changeOutgoingNumbers = (outgoing_numbers: string) => {
    this.filter.outgoing_numbers = outgoing_numbers;
    this.setFilterToLocalStorage();
  };

  setFilterToLocalStorage() {
    const filterData = {
      filter: this.filter,
      is_allFilter: this.is_allFilter
    };
    window.localStorage.setItem("filter_application", JSON.stringify(filterData));
  }
  getValuesFromLocalStorage() {
    const filterData = window.localStorage.getItem("filter_application");
    if (filterData) {
      const data = JSON.parse(filterData);

      // Проверяем новый формат данных
      if (data.filter) {
        let filt = data.filter;
        if (filt.date_start !== null) {
          filt.date_start = dayjs(filt.date_start);
        }
        if (filt.date_end !== null) {
          filt.date_end = dayjs(filt.date_end);
        }
        if (filt.status_ids === null) {
          filt.status_ids = []
        }
        this.filter = filt;
        this.is_allFilter = data.is_allFilter || false;
      } else {
        // Обратная совместимость со старым форматом
        let filt = data;
        if (filt.date_start !== null) {
          filt.date_start = dayjs(filt.date_start);
        }
        if (filt.date_end !== null) {
          filt.date_end = dayjs(filt.date_end);
        }
        if (filt.status_ids === null) {
          filt.status_ids = []
        }
        this.is_allFilter = !(filt.useCommon ?? true);
        this.filter = filt;
      }
    }
  }

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
      if (this.isJournal) {
        this.filter.is_journal = true;
      }
      const response = await getApplicationsPaginationRefusal(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.totalCount = response.data.totalCount;
        if (this.filter.pageNumber > 0) {
          this.data = [...this.data, ...response.data.items];
        } else {
          this.data = response.data.items;
        }
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

  saveFilter = async () => {
    appFilterStore.onSaveFilter(JSON.stringify(toJS(this.filter)));
    appFilterStore.openPanel = false;
  }

  closeFilter = async () => {
    appFilterStore.openPanel = false;
  }

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

  setSelectedReestr(id: number, name: string) {
    this.selectedReestrId = id;
    this.selectedReestrName = name;
    localStorage.setItem("selectedReestrId", id + "");
    localStorage.setItem("selectedReestrName", name);
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
        throw response;
      }
    } catch (err) {
      if (err?.response?.data) {
        let raw = err.response.data;
        if (typeof raw === "string") {
          raw = raw
            .replace(/^{\s*StatusCode\s*=\s*/i, '{"StatusCode":')
            .replace(/,\s*Message\s*=\s*/, ',"Message":');
        }
        try {
          const parsedObject = JSON.parse(raw);
          const serverMessage = parsedObject?.Message?.Message;

          if (serverMessage && serverMessage.includes("Заявка уже находится в другом реестре")) {
            this.messageError = serverMessage;
            this.openError = true;
            return;
          }
        } catch (e) {
          console.error("Ошибка парсинга server error", e);
        }
      }
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  exportApplicationsToExcel = async () => {
    try {
      MainStore.changeLoader(true);

      // Создаем копию фильтра для получения ВСЕХ записей
      const excelFilter = { ...this.filter };

      // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: устанавливаем большие значения для получения всех записей
      excelFilter.pageNumber = 0;
      excelFilter.pageSize = 500; // Большое число для получения всех записей
      excelFilter.only_count = false;

      if (this.isJournal) {
        excelFilter.is_journal = true;
      }

      // Используем тот же метод что и для обычной загрузки
      const response = await getApplicationsPaginationRefusal(excelFilter);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const allData = response.data.items || [];

        // ОБНОВЛЯЕМ totalCount для корректной работы snackbar
        this.totalCount = response.data.totalCount || allData.length;

        if (!allData || allData.length === 0) {
          MainStore.setSnackbar("Нет данных для экспорта по заданным фильтрам", "warning");
          return [];
        }

        return allData;
      } else {
        if (response?.response?.status === 400) {
          this.clearFilter();
          throw new Error("Некорректные параметры фильтра. Фильтр сброшен.");
        }
        throw new Error("Не удалось получить данные для экспорта");
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      throw err;
    } finally {
      MainStore.changeLoader(false);
    }
  };

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

  async setFavorite(applicationId: number) {
    const index = this.data.findIndex(x => x.id === applicationId);
    if (index === -1) return;

    const row = this.data[index];

    try {
      if (row.is_favorite) {
        await deleteToFavorite(applicationId);
      } else {
        await addToFavorite(applicationId);
      }

      runInAction(() => {
        this.data[index] = {
          ...row,
          is_favorite: !row.is_favorite,
        };
      });
    } catch (e) {
      console.error("Favorite error", e);
    }
  }

  // setFavoriteFilter(value: boolean) {
  //   this.filter.is_favorite_only = value;
  //   if (value) {
  //     this.data = this.data.filter(x => x.is_favorite == true);
  //   } else {
  //     this.filter.pageNumber = 0;
  //     this.loadApplications();
  //   }
  // }
}

export default new NewStore();