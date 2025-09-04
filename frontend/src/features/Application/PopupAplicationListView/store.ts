import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { FilterApplication } from "../../../constants/Application";
import { getApplicationPagination } from "../../../api/Application/useGetApplications";
import { GridSortModel } from "@mui/x-data-grid";
import { getlegal_act_registriesByAddress } from "api/legal_act_registry";
import { getlegal_record_registriesByAddress } from "api/legal_record_registry";
class NewStore {
  filter: FilterApplication = {
    pageSize: 70,
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
    only_count: true,
    total_sum_from: null,
    total_sum_to: null,
    total_payed_from: null,
    total_payed_to: null,

    tunduk_district_id: null,
    tunduk_address_unit_id: null,
    tunduk_street_id: null,
  };

  totalCount: number;
  applications: [];
  legalRecords: [];
  legalActs: [];
  openCustomerApplicationDialog: false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.filter = {
        pageSize: 70,
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
        only_count: true,
        total_sum_from: null,
        total_sum_to: null,
        total_payed_from: null,
        total_payed_to: null,
      } as FilterApplication;
      this.applications = [];
      this.legalRecords = [];
      this.legalActs = [];
    });
  }



  handleChange(event, name?: string) {
    if (name) {
      this[name][event.target.name] = event.target.value;
      return;
    }
    this[event.target.name] = event.target.value;
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.filter.pageNumber = page;
      this.filter.pageSize = pageSize;
    });
    this.loadApplications();
    this.loadLegalActs();
    this.loadLegalRecords();
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
    this.loadLegalActs();
    this.loadLegalRecords();
  };

  loadApplications = async (filters?, loading?: () => void) => {
    try {
      if (this.filter.only_count === false) {
        MainStore.changeLoader(true);
      } else {
        if (loading)
          loading();
      }
      const filterData = this.filter;
      if (filters) {
        filterData.common_filter = filters;
      }
      const response = await getApplicationPagination(filterData);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        if (filters) {
          return response.data.totalCount;
        }
        this.applications = response.data.items;
        this.totalCount = response.data.totalCount;
      } else {
        if (response?.response?.status === 400) {
          // this.clearFilter();
          await this.loadApplications();
          await this.loadLegalActs();
          await this.loadLegalRecords();
          return;
        }
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      if (this.filter.only_count === false) {
        MainStore.changeLoader(false);
      } else {
        if (loading)
          loading();
      }
    }
  };


  loadLegalActs = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registriesByAddress(this.filter.address);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.legalActs = response.data
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

  loadLegalRecords = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_record_registriesByAddress(this.filter.address);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.legalRecords = response.data
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

}




const PopupApplicationStore = new NewStore()
export default PopupApplicationStore;
