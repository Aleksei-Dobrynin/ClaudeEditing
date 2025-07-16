import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationReport, getApplicationReportPaginated } from "api/Application/useGetApplications";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import { getStructures } from "../../../api/Structure/useGetStructures";
import printJS from "print-js";
import { GridSortModel } from "@mui/x-data-grid";


class NewStore {
  data = [];
  monthDict = [];
  yearDict = [];
  Structures = [];
  month_id = null;
  year_id = null;
  structure_id = null;
  isOrg = null;
  errors: { [key: string]: string } = {};
  title = ""

  pageSize = 10;
  pageNumber = 0;
  orderType = null;
  orderBy = null;
  totalCount = 0;
  totalPages = 0

  constructor() {
    makeAutoObservable(this);
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.pageNumber = page;
      this.pageSize = pageSize;
    });
    this.loadApplicationReport();
  };
  
  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.orderBy = null;
        this.orderType = null;
      } else {
        this.orderBy = sortModel[0].field;
        this.orderType = sortModel[0].sort;
      }
    });
    this.loadApplicationReport();
  };

  clearFilters(){
    runInAction(() => {
        this.month_id = 1;
        this.year_id = 4;
        this.structure_id = 0; // this.Structures.find(x => true)?.id;
    })
  }
  doLoad() {
    this.title = `${i18n.t(this.isOrg ? "label:ApplicationReportListView.titleorg" : "label:ApplicationReportListView.titlephyz")}`
    this.getMounts();
    this.getYears();
    this.loadStructures();
    this.loadApplicationReport();
  }

  handleChange(event: any) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.title = `${i18n.t(this.isOrg ? "label:ApplicationReportListView.titleorg" : "label:ApplicationReportListView.titlephyz")} 
        ${this.month_id && this.month_id != 0 ? `за ${this.monthDict[this.month_id - 1]?.name} ${i18n.t("label:ApplicationReportListView.month")}` : ""}
        ${this.year_id && this.year_id != 0 ? `${this.yearDict[this.year_id - 1]?.name} ${i18n.t("label:ApplicationReportListView.year")}` : ""} 
        ${this.structure_id && this.structure_id != 0 ? `${i18n.t("label:ApplicationReportListView.structure")}: ${this.Structures.find(x => x.id == this.structure_id)?.name}` : ""}`
  }

  getMounts() {
    if (this.monthDict.length > 0) {
      return;
    }
    dayjs.extend(localeData);
    dayjs.locale('ru');
    console.log(i18n);
    const monthList = dayjs.localeData().months();
    monthList.forEach((month, index) => {
      this.monthDict.push({ id: index + 1, name: month });
    });
    this.month_id = 1;
  }

  getYears() {
    if (this.yearDict.length) return;

    const currentYear = new Date().getFullYear();
    this.yearDict = Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      name: (currentYear - 3 + index).toString(),
    }));
    this.year_id = 4;
  }

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structures = response.data;
        //this.structure_id = this.Structures.find(x => true)?.id;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  printApplicationReport() {
    console.log(this.data)
    printJS({
      printable: this.data,
      type: 'json',
      properties: [
        { field: 'order_number', displayName: i18n.t("label:ApplicationReportListView.order_number")},
        { field: 'number_data', displayName: i18n.t("label:ApplicationReportListView.number_data")},
        { field: 'customer_name', displayName: i18n.t("label:ApplicationReportListView.customer_name")},
        { field: 'arch_object_name', displayName: i18n.t("label:ApplicationReportListView.arch_object_name")},
        { field: 'price', displayName: i18n.t("label:ApplicationReportListView.price")},
        { field: 'nds', displayName: i18n.t("label:ApplicationReportListView.nds")},
        { field: 'nsp', displayName: i18n.t("label:ApplicationReportListView.nsp")},
        { field: 'sum', displayName: i18n.t("label:ApplicationReportListView.sum")}
      ],
      header: `${this.title}`,
    })
  }

  // loadApplicationReport = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getApplicationReport(this.isOrg, this.month_id, this.yearDict[this.year_id - 1]?.name ?? null, this.structure_id);
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.data = response.data.map(x => {
  //         const formattedRegistrationDate = x.registration_date
  //           ? dayjs(x.registration_date).format("DD.MM.YYYY")
  //           : "";
  //         return {
  //           ...x,
  //           number_data: `${x.number} ${formattedRegistrationDate ? `(${formattedRegistrationDate})` : ""}`,
  //         };
  //       });
  //       console.log(this.data)
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     console.log(err)
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };

  loadApplicationReport = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationReportPaginated(this.isOrg, this.month_id, this.yearDict[this.year_id - 1]?.name ?? null, this.structure_id, this.pageSize, this.pageNumber,this.orderBy, this.orderType);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data.items.map(x => {
          const formattedRegistrationDate = x.registration_date
            ? dayjs(x.registration_date).format("DD.MM.YYYY")
            : "";
          return {
            ...x,
            number_data: `${x.number} ${formattedRegistrationDate ? `(${formattedRegistrationDate})` : ""}`,
          };
        });
        this.totalPages = response.data.totalPages;
        this.totalCount = response.data.totalCount;
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err)
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearStore = () => {
    this.data = [];
    this.monthDict = [];
    this.yearDict = [];
    this.Structures = [];
    this.month_id = 0;
    this.year_id = 0;
    this.errors = {};
    this.isOrg = null;
  };
}

export default new NewStore();
