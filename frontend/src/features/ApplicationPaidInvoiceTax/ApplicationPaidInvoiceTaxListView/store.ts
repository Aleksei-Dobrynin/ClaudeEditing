import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationWithTaxAndDateRange } from "api/ApplicationPaidInvoice/useGetApplicationPaidInvoices";
import DateTimeField from "components/DateTimeField";
import {  validateField } from "./valid";

class NewStore {
  data = [];
  total = {};
  startDate = "";
  endDate = "";
  openPanel = false;
  currentId = 0;
  idMain = 0

  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name , value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors = {};
    } else {
      this.errors[name] = error;
    }
  }


  loadApplicationPaidTaxByIdApplication = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWithTaxAndDateRange(this.startDate, this.endDate);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        this.data.push({
          id: "defoultRow",
          date: "Total",
          sum: this.data.reduce((sum: number, row) => sum + (typeof row.sum === 'number' ? row.sum : 0), 0),
          tax: this.data.reduce((sum: number, row) => sum + (typeof row.tax === 'string' ? parseFloat(row.tax) : 0), 0)
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

  searchHandler = async () => {
      this.loadApplicationPaidTaxByIdApplication();
  };

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0
    });
  };
}

export default new NewStore();
