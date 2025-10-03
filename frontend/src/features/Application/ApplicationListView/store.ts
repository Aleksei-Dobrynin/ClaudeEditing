import { makeAutoObservable, observable, runInAction, action, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationPagination, getApplicationPaginationFinPlan } from "api/Application/useGetApplications";
import { deleteApplication } from "api/Application/useDeleteApplication";
import { GridSortModel } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { getServices } from "api/Service/useGetServices";
import { FilterApplication } from "constants/Application";
import {
  getDistricts,
  getTundukDistricts,
  getAteChildren,
  searchStreet
} from "api/District/useGetDistricts";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getTags } from "api/Tag/useGetTags";
import { getEmployees, getRegisterEmployees } from "../../../api/Employee/useGetEmployees";
import appFilterStore from "../../ApplicationFilter/ApplicationFilterAddEditView/store";
import { getCheckApplicationBeforeRegistering, setApplicationToReestr } from "../../../api/reestr";
import { getDocumentJournalss } from "../../../api/DocumentJournals";
import { getApplicationDocument, getApplicationTemplates } from "../../../api/S_DocumentTemplate";
import printJS from "print-js";
import { TUNDUK_TO_REGULAR_DISTRICT_MAP, getRegularDistrictId } from "constants/constant";
import {
  getEmployeeSavedFilters,
  createEmployeeSavedFilter,
  updateEmployeeSavedFilter,
  deleteEmployeeSavedFilter,
  markEmployeeSavedFilterAsUsed
} from "../../../api/EmployeeSavedFilters/useEmployeeSavedFilters";

type N8nValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

class NewStore {
  data = [];
  Journals = [];
  openPanel = false;
  isOpenSelectLang = false;
  selectedLang = '';
  selectTemplate_id = 0;
  currentId = 0;
  totalCount = 0;
  is_allFilter = false;
  titleError = "";
  messageError = "";
  openError = false;
  selectedIds = [];

  // Saved filters functionality
  savedFilters = [];
  openSaveFilterDialog = false;
  newFilterName = "";
  openLoadFilterDialog = false;
  selectedSavedFilterId = null;

  // Добавляем таймер для дебаунса localStorage
  localStorageDebounceTimer = null;

  // Добавляем новые поля для Tunduk адресов
  TundukDistricts = [];
  TundukResidentialAreas = [];
  streetSearchState = {
    inputValue: '',
    selectedStreet: null,
    isOpen: false,
    searchResults: [],
    isLoading: false
  };
  streetSearchTimer = null;

  filter: FilterApplication = {
    pageSize: 100,
    pageNumber: 0,
    sort_by: null,
    sort_type: null,
    pin: "",
    customerName: "",
    date_start: null,
    date_end: null,
    service_ids: [], // Убедимся, что это пустой массив
    status_ids: [], // Убедимся, что это пустой массив
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
    structure_ids: [], // Убедимся, что это пустой массив
    incoming_numbers: "",
    outgoing_numbers: "",
    only_count: false,
    is_paid: null,
    total_sum_from: null,
    total_sum_to: null,
    total_payed_from: null,
    total_payed_to: null,
    app_ids: [], // Убедимся, что это пустой массив
    // Новые поля для фильтрации
    tunduk_district_id: null,
    tunduk_address_unit_id: null,
    tunduk_street_id: null,
    for_signature: false
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
  ApplicationTemplates = [];
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
    makeAutoObservable(this, {
      filter: observable.deep,
      changeStatus: action,
      changeService: action, // 👈 теперь все вложенные поля filter — observable
      // остальные поля можно оставить — makeAutoObservable их и так обработает
    });

  }

  // Оптимизированный метод для сохранения в localStorage с дебаунсом
  setFilterToLocalStorageDebounced = () => {
    if (this.localStorageDebounceTimer) {
      clearTimeout(this.localStorageDebounceTimer);
    }

    this.localStorageDebounceTimer = setTimeout(() => {
      const filterData = {
        filter: this.filter,
        is_allFilter: this.is_allFilter
      };
      window.localStorage.setItem("filter_application", JSON.stringify(filterData));
    }, 500); // Задержка 500мс перед сохранением
  };

  // Немедленное сохранение (для критичных изменений)
  setFilterToLocalStorageImmediate = () => {
    if (this.localStorageDebounceTimer) {
      clearTimeout(this.localStorageDebounceTimer);
      this.localStorageDebounceTimer = null;
    }

    const filterData = {
      filter: this.filter,
      is_allFilter: this.is_allFilter
    };
    window.localStorage.setItem("filter_application", JSON.stringify(filterData));
  };

  // Старый метод для обратной совместимости
  setFilterToLocalStorage = () => {
    this.setFilterToLocalStorageDebounced();
  };

  // ===== SAVED FILTERS METHODS =====

  loadSavedFilters = async () => {
    try {
      const response = await getEmployeeSavedFilters();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.savedFilters = response.data.sort((a, b) => {
            if (b.usage_count !== a.usage_count) {
              return (b.usage_count || 0) - (a.usage_count || 0);
            }
            if (a.last_used_at && b.last_used_at) {
              return new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime();
            }
            return 0;
          });
        });
      }
    } catch (err) {
      console.error("Error loading saved filters:", err);
    }
  };

  openSaveFilterDialogHandler = () => {
    this.openSaveFilterDialog = true;
    this.newFilterName = "";
  };

  closeSaveFilterDialog = () => {
    this.openSaveFilterDialog = false;
    this.newFilterName = "";
  };

  saveCurrentFilter = async () => {
    try {
      if (!this.newFilterName.trim()) {
        MainStore.setSnackbar("Введите название фильтра", "warning");
        return;
      }

      MainStore.changeLoader(true);

      const filterData = {
        filter_name: this.newFilterName,
        is_active: true,
        is_default: false,
        page_size: this.filter.pageSize,
        page_number: this.filter.pageNumber,
        sort_by: this.filter.sort_by,
        sort_type: this.filter.sort_type,
        pin: this.filter.pin || "",
        customer_name: this.filter.customerName || "",
        common_filter: this.filter.common_filter || "",
        address: this.filter.address || "",
        number: this.filter.number || "",
        incoming_numbers: this.filter.incoming_numbers || "",
        outgoing_numbers: this.filter.outgoing_numbers || "",
        date_start: this.filter.date_start,
        date_end: this.filter.date_end,
        service_ids: this.filter.service_ids?.join(",") || "",
        status_ids: this.filter.status_ids?.join(",") || "",
        structure_ids: this.filter.structure_ids?.join(",") || "",
        app_ids: this.filter.app_ids?.join(",") || "",
        district_id: this.filter.district_id,
        tag_id: this.filter.tag_id,
        filter_employee_id: this.filter.employee_id,
        journals_id: this.filter.journals_id,
        tunduk_district_id: this.filter.tunduk_district_id,
        tunduk_address_unit_id: this.filter.tunduk_address_unit_id,
        tunduk_street_id: this.filter.tunduk_street_id,
        deadline_day: this.filter.deadline_day,
        total_sum_from: this.filter.total_sum_from,
        total_sum_to: this.filter.total_sum_to,
        total_payed_from: this.filter.total_payed_from,
        total_payed_to: this.filter.total_payed_to,
        is_expired: this.filter.isExpired,
        is_my_org_application: this.filter.isMyOrgApplication,
        without_assigned_employee: this.filter.withoutAssignedEmployee,
        use_common: this.filter.useCommon,
        only_count: this.filter.only_count,
        is_journal: this.isJournal,
        is_paid: this.filter.is_paid,
        last_used_at: new Date().toISOString(),
        usage_count: 0
      };

      const response = await createEmployeeSavedFilter(filterData);

      if ((response.status === 201 || response.status === 200)) {
        MainStore.setSnackbar("Фильтр успешно сохранен", "success");
        this.closeSaveFilterDialog();
        await this.loadSavedFilters();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadSavedFilter = async (filterId: number) => {
    try {
      MainStore.changeLoader(true);

      await markEmployeeSavedFilterAsUsed(filterId);

      const savedFilter = this.savedFilters.find(f => f.id === filterId);
      if (!savedFilter) {
        throw new Error("Filter not found");
      }

      runInAction(() => {
        // Безопасное преобразование строк в массивы чисел
        const parseIds = (idsString: string | null | undefined): number[] => {
          if (!idsString) return [];
          try {
            return idsString.split(",")
              .map(id => parseInt(id.trim()))
              .filter(id => !isNaN(id));
          } catch {
            return [];
          }
        };

        this.filter = {
          ...this.filter,
          pageSize: savedFilter.page_size || 100,
          pageNumber: savedFilter.page_number || 0,
          sort_by: savedFilter.sort_by,
          sort_type: savedFilter.sort_type,
          pin: savedFilter.pin || "",
          customerName: savedFilter.customer_name || "",
          common_filter: savedFilter.common_filter || "",
          address: savedFilter.address || "",
          number: savedFilter.number || "",
          incoming_numbers: savedFilter.incoming_numbers || "",
          outgoing_numbers: savedFilter.outgoing_numbers || "",
          date_start: savedFilter.date_start,
          date_end: savedFilter.date_end,
          service_ids: parseIds(savedFilter.service_ids),
          status_ids: parseIds(savedFilter.status_ids),
          structure_ids: parseIds(savedFilter.structure_ids),
          app_ids: parseIds(savedFilter.app_ids),
          district_id: savedFilter.district_id,
          tag_id: savedFilter.tag_id,
          employee_id: savedFilter.filter_employee_id,
          journals_id: savedFilter.journals_id,
          tunduk_district_id: savedFilter.tunduk_district_id,
          tunduk_address_unit_id: savedFilter.tunduk_address_unit_id,
          tunduk_street_id: savedFilter.tunduk_street_id,
          deadline_day: savedFilter.deadline_day || 0,
          total_sum_from: savedFilter.total_sum_from,
          total_sum_to: savedFilter.total_sum_to,
          total_payed_from: savedFilter.total_payed_from,
          total_payed_to: savedFilter.total_payed_to,
          isExpired: savedFilter.is_expired || false,
          isMyOrgApplication: savedFilter.is_my_org_application || false,
          withoutAssignedEmployee: savedFilter.without_assigned_employee || false,
          useCommon: savedFilter.use_common !== false,
          only_count: savedFilter.only_count || false,
          is_paid: savedFilter.is_paid
        };

        this.is_allFilter = !this.filter.useCommon;

        if (this.filter.tunduk_district_id) {
          this.loadTundukResidentialAreas(this.filter.tunduk_district_id);
        }
      });

      this.openLoadFilterDialog = false;
      this.selectedSavedFilterId = filterId;

      await this.loadApplications();

      MainStore.setSnackbar(`Фильтр "${savedFilter.filter_name}" применен`, "success");

      await this.loadSavedFilters();
    } catch (err) {
      MainStore.setSnackbar("Ошибка при загрузке фильтра", "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteSavedFilter = async (filterId: number) => {
    MainStore.openErrorConfirm(
      "Вы уверены что хотите удалить этот фильтр?",
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteEmployeeSavedFilter(filterId);
          if (response.status === 201 || response.status === 200) {
            await this.loadSavedFilters();
            MainStore.setSnackbar("Фильтр успешно удален", "success");
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

  openLoadFilterDialogHandler = () => {
    this.openLoadFilterDialog = true;
  };

  closeLoadFilterDialog = () => {
    this.openLoadFilterDialog = false;
  };

  // ===== МЕТОДЫ ДЛЯ TUNDUK АДРЕСОВ =====

  changeTundukDistrict = async (districtId: number) => {
    runInAction(() => {
      this.filter.tunduk_district_id = districtId;
      this.filter.tunduk_address_unit_id = null;
      this.filter.tunduk_street_id = null;
      this.filter.district_id = getRegularDistrictId(districtId);

      this.streetSearchState = {
        inputValue: '',
        selectedStreet: null,
        isOpen: false,
        searchResults: [],
        isLoading: false
      };
    });

    if (districtId) {
      await this.loadTundukResidentialAreas(districtId);
    } else {
      this.TundukResidentialAreas = [];
      runInAction(() => {
        this.filter.district_id = 6;
      });
    }

    this.setFilterToLocalStorageDebounced();
  };

  changeTundukAddressUnit = (addressUnitId: number) => {
    runInAction(() => {
      this.filter.tunduk_address_unit_id = addressUnitId;
      this.filter.tunduk_street_id = null;

      this.streetSearchState = {
        inputValue: '',
        selectedStreet: null,
        isOpen: false,
        searchResults: [],
        isLoading: false
      };
    });

    this.setFilterToLocalStorageDebounced();
  };

  changeTundukStreet = (streetId: number, streetData?: any) => {
    runInAction(() => {
      this.filter.tunduk_street_id = streetId;

      if (streetData && streetData.address_unit_id) {
        this.autoSetDistrictFromStreet(streetData);
      }
    });

    this.setFilterToLocalStorageDebounced();
  };

  autoSetDistrictFromStreet = async (streetData: any) => {
    if (!streetData.address_unit_id) return;

    const residentialArea = this.TundukResidentialAreas.find(
      area => area.id === streetData.address_unit_id
    );

    if (residentialArea) {
      runInAction(() => {
        this.filter.tunduk_address_unit_id = residentialArea.id;

        if (residentialArea.parent_id) {
          this.filter.tunduk_district_id = residentialArea.parent_id;
          this.filter.district_id = getRegularDistrictId(residentialArea.parent_id);
        }
      });
    } else {
      const district = this.TundukDistricts.find(
        d => d.id === streetData.address_unit_id
      );

      if (district) {
        runInAction(() => {
          this.filter.tunduk_district_id = district.id;
          this.filter.tunduk_address_unit_id = null;
          this.filter.district_id = getRegularDistrictId(district.id);
        });
      }
    }
  };

  searchTundukStreets = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      runInAction(() => {
        this.streetSearchState.searchResults = [];
        this.streetSearchState.isLoading = false;
      });
      return;
    }

    runInAction(() => {
      this.streetSearchState.isLoading = true;
    });

    try {
      let filterAteId = 0;
      if (this.filter.tunduk_address_unit_id) {
        filterAteId = this.filter.tunduk_address_unit_id;
      } else if (this.filter.tunduk_district_id) {
        filterAteId = this.filter.tunduk_district_id;
      }

      const response = await searchStreet(searchQuery, filterAteId);

      if (response && response.status === 200 && response.data) {
        runInAction(() => {
          this.streetSearchState.searchResults = response.data;
          this.streetSearchState.isLoading = false;
        });
      }
    } catch (error) {
      console.error('Ошибка поиска улиц:', error);
      runInAction(() => {
        this.streetSearchState.searchResults = [];
        this.streetSearchState.isLoading = false;
      });
    }
  };

  handleStreetInputChange = (inputValue: string) => {
    runInAction(() => {
      this.streetSearchState.inputValue = inputValue;
    });

    if (this.streetSearchTimer) {
      clearTimeout(this.streetSearchTimer);
    }

    this.streetSearchTimer = setTimeout(() => {
      this.searchTundukStreets(inputValue);
    }, 300);
  };

  loadTundukDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTundukDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.TundukDistricts = response.data;
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

  loadTundukResidentialAreas = async (districtId: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getAteChildren(districtId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.TundukResidentialAreas = response.data;
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

  // ===== ОСНОВНЫЕ МЕТОДЫ =====

  onEditClicked(id: number) {
    // существующий код
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

  changeSelect(id: number, isCheck: boolean) {
    const item = this.data.find(x => x.id === id);
    item.select_application = isCheck;
    this.data = [...this.data];
    this.selectedIds = this.data.filter(x => x.select_application).map(x => x.id);
  }

  clearFilter = () => {
    if (this.localStorageDebounceTimer) {
      clearTimeout(this.localStorageDebounceTimer);
      this.localStorageDebounceTimer = null;
    }

    runInAction(() => {
      this.filter = {
        pageSize: 100,
        pageNumber: 0,
        sort_by: null,
        sort_type: null,
        pin: "",
        customerName: "",
        date_start: null,
        date_end: null,
        service_ids: [], // Пустой массив
        status_ids: [],  // Пустой массив
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
        total_sum_from: null,
        total_sum_to: null,
        total_payed_from: null,
        total_payed_to: null,
        app_ids: [],
        tunduk_district_id: null,
        tunduk_address_unit_id: null,
        tunduk_street_id: null,
      for_signature: false
      };

      this.streetSearchState = {
        inputValue: '',
        selectedStreet: null,
        isOpen: false,
        searchResults: [],
        isLoading: false
      };

      this.TundukResidentialAreas = [];
      this.is_allFilter = false;
    });

    this.setFilterToLocalStorageImmediate();
  };

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
    this.loadApplicationTemplate();
    this.loadTundukDistricts();
    this.loadSavedFilters();
  }

  changeAllFilter = (event) => {
    runInAction(() => {
      this.is_allFilter = event.target.value;
      if (this.filter) {
        this.filter.useCommon = !this.is_allFilter;
      }
    });
    this.setFilterToLocalStorageImmediate();
  };

  changeService = (ids: number[]) => {
    runInAction(() => {
      // Создаем новый массив, а не модифицируем существующий
      this.filter.service_ids = [...ids];
      this.setFilterToLocalStorage();
    });
  };

  changeStatus = (ids: number[]) => {
    runInAction(() => {
      // Создаем новый массив, а не модифицируем существующий
      this.filter.status_ids = [...ids];
      this.setFilterToLocalStorage();
    });
  };

  changeDateStart = (date: Dayjs) => {
    runInAction(() => {
      if (date != null) {
        this.filter.date_start = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        this.filter.date_start = null;
      }
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeDateEnd = (date: Dayjs) => {
    runInAction(() => {
      if (date != null) {
        this.filter.date_end = date.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        this.filter.date_end = null;
      }
    });
    this.setFilterToLocalStorageDebounced();
  };

  changePin = (pin: string) => {
    runInAction(() => {
      this.filter.pin = pin;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeJournalId = (journals_id: number) => {
    runInAction(() => {
      this.filter.journals_id = journals_id;
    });
  };

  changeCustomerName = (customerName: string) => {
    runInAction(() => {
      this.filter.customerName = customerName;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeAddress = (address: string) => {
    runInAction(() => {
      this.filter.address = address;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeCommonFilter = (common_filter: string) => {
    runInAction(() => {
      this.filter.common_filter = common_filter;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeNumber = (number: string) => {
    runInAction(() => {
      this.filter.number = number;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeDistrict = (id: number) => {
    runInAction(() => {
      this.filter.district_id = id;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeDeadlineDay = (id: number) => {
    runInAction(() => {
      this.filter.deadline_day = id;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeTotalSumFrom = (value: string) => {
    runInAction(() => {
      this.filter.total_sum_from = value ? parseFloat(value) : null;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeTotalSumTo = (value: string) => {
    runInAction(() => {
      this.filter.total_sum_to = value ? parseFloat(value) : null;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeTotalPayedFrom = (value: string) => {
    runInAction(() => {
      this.filter.total_payed_from = value ? parseFloat(value) : null;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeTotalPayedTo = (value: string) => {
    runInAction(() => {
      this.filter.total_payed_to = value ? parseFloat(value) : null;
    });
    this.setFilterToLocalStorageDebounced();
  };

  handleCheckboxChangeWithLoad = (fieldName: string, value: boolean, customHandler?: () => void) => {
    const prevValue = this.filter[fieldName];

    runInAction(() => {
      if (customHandler) {
        customHandler();
      } else {
        this.filter[fieldName] = value;
      }
    });

    if (prevValue === true && value === false) {
      this.loadApplications();
    }

    if (fieldName !== 'is_paid') {
      this.setFilterToLocalStorageDebounced();
    }
  };

  changeIsPaid = (isPaid: boolean, autoLoad: boolean = false) => {
    runInAction(() => {
      const prevIsPaid = this.filter.is_paid === isPaid;

      if (this.filter.is_paid == isPaid) {
        this.filter.is_paid = null;
        this.loadApplications();
      } else {
        this.filter.is_paid = isPaid;
      }
    });
  };

  changeTag = (id: number) => {
    runInAction(() => {
      this.filter.tag_id = id;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeEmployee = (id: number) => {
    runInAction(() => {
      this.filter.employee_id = id;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeIncomingNumbers = (incoming_numbers: string) => {
    runInAction(() => {
      this.filter.incoming_numbers = incoming_numbers;
    });
    this.setFilterToLocalStorageDebounced();
  };

  changeOutgoingNumbers = (outgoing_numbers: string) => {
    runInAction(() => {
      this.filter.outgoing_numbers = outgoing_numbers;
    });
    this.setFilterToLocalStorageDebounced();
  };

  getValuesFromLocalStorage = () => {
    const filterData = window.localStorage.getItem("filter_application");
    if (filterData) {
      try {
        const data = JSON.parse(filterData);

        let filt = data.filter || data;

        // Преобразование дат
        if (filt.date_start !== null) {
          filt.date_start = dayjs(filt.date_start);
        }
        if (filt.date_end !== null) {
          filt.date_end = dayjs(filt.date_end);
        }

        // Гарантируем что массивы всегда инициализированы
        filt.status_ids = Array.isArray(filt.status_ids) ? filt.status_ids : [];
        filt.service_ids = Array.isArray(filt.service_ids) ? filt.service_ids : [];
        filt.structure_ids = Array.isArray(filt.structure_ids) ? filt.structure_ids : [];
        filt.app_ids = Array.isArray(filt.app_ids) ? filt.app_ids : [];

        this.filter = filt;
        this.is_allFilter = data.is_allFilter || false;

        if (this.filter.tunduk_district_id) {
          this.filter.district_id = getRegularDistrictId(this.filter.tunduk_district_id);
          this.loadTundukResidentialAreas(this.filter.tunduk_district_id);
        } else {
          this.filter.district_id = 6;
        }
      } catch (error) {
        console.error('Error parsing filter data from localStorage:', error);
        // В случае ошибки парсинга, инициализируем с пустыми массивами
        this.filter.status_ids = [];
        this.filter.service_ids = [];
        this.filter.structure_ids = [];
        this.filter.app_ids = [];
      }
    }
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
      if (this.isJournal) {
        this.filter.is_journal = true;
      }
      const response = this.isFinPlan ? await getApplicationPaginationFinPlan(this.filter) : await getApplicationPagination(this.filter);
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

  loadApplicationTemplate = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ApplicationTemplates = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  selectTemplate = async () => {
    try {
      MainStore.changeLoader(true);
      var data = {
        template_id: this.selectTemplate_id,
        language_code: this.selectedLang,
        selected_apps: this.selectedIds,
      };
      const response = await getApplicationDocument(data);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const allDocs = response.data.join("<div style='page-break-after: always;'></div>");
        printJS({
          printable: allDocs,
          type: "raw-html",
          targetStyles: ["*"],
        });
        this.selectTemplate_id = 0;
        this.selectedLang = '';
        this.data.forEach(x => x.select_application = false);
        this.selectedIds = [];
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

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
            this.data = JSON.parse(JSON.stringify(newArray));
          });
        }
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

      const excelFilter = { ...this.filter };
      excelFilter.pageNumber = 0;
      excelFilter.pageSize = 500;
      excelFilter.only_count = false;

      if (this.isJournal) {
        excelFilter.is_journal = true;
      }

      const response = this.isFinPlan
        ? await getApplicationPaginationFinPlan(excelFilter)
        : await getApplicationPagination(excelFilter);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const allData = response.data.items || [];
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
}

export default new NewStore();