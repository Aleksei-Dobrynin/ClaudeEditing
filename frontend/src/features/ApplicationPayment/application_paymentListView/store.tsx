import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  createapplication_payment,
  deleteapplication_payment,
  getapplication_paymentsPDFDocument,
  getapplication_paymentsPrintDocument,
  getApplicationSumByApplication_id,
  saveApplicationTotalSum,
  updateapplication_payment
} from "api/application_payment";
import { getapplication_paymentsByapplication_id, getapplication_paymentssum } from "api/application_payment";
import { getDistricts } from "api/District/useGetDistricts";
import { getorg_structures } from "api/org_structure"
import { GridSortModel } from "@mui/x-data-grid";
import dayjs, { Dayjs } from 'dayjs';
import { getMyOrgStructures } from "api/org_structure";
import printJS from "print-js";
import { getCustomerDiscountByIdApplication } from "../../../api/CustomerDiscount";
import { validate, validateField } from "./valid";
import { number } from "yup";
import workDocumentStore from "../../ApplicationWorkDocument/ApplicationWorkDocumentListView/store";
import store from "../application_paymentTask/store";
import storeList from "../application_paymentListView/store";


class NewStore {
  data = [];
  org_structures = [];
  totalSum = 0;
  first_user_structure_id = 0;
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  structures = [];
  structures_ids = [];
  pageNumber = 0;
  pageSize = 10;
  totalCount = 0;
  sort_by = "";
  sort_type = "";
  startDate = dayjs()
  endDate = dayjs()
  errors_startDate = ""
  errors_endDate = ""
  forApplication = false;
  customer_discount = null;
  is_show_discount = null;
  application_sum_wo_discount = 0;
  application_sum_wo_discount_and_tax = 0;
  application_nds_value = 0;
  application_nsp_value = 0;
  application_total_sum = 0;
  application_is_percentage = false;
  application_discount_percentage = 0;
  application_discount_value = 0;
  application_discount_percentage_value = 0;
  application_disable_nds = false;
  application_nds = 0;
  application_disable_nsp = false;
  application_nsp = 0;
  isDiscountForm = false;

  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    this.openPanel = true;
    this.currentId = id;
  }

  closePanel() {
    this.openPanel = false;
    this.currentId = 0;
  }

  printForStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_paymentsPrintDocument(this.idMain);
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

  getPDFForStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_paymentsPDFDocument(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const mimeType = response.data.contentType || 'application/octet-stream';
        const fileNameBack = response.data.fileDownloadName;

        let url = ""

        if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('?? ??????? ??????? ????? ????. ????????, ??? ???? ?????????????.');
          }
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

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  setOpenDiscountForm = (value: boolean) => {
    this.isDiscountForm = value;
  }

  async onSaveDiscountClick(onSaved: (id: number) => void) {
    var data = {
      application_id: this.idMain - 0,
      sum_wo_discount: this.application_sum_wo_discount,
      nds_value: this.application_nds_value,
      nsp_value: this.application_nsp_value,
      total_sum: this.application_total_sum,
      discount_percentage: this.application_discount_percentage,
      discount_value: this.application_discount_value,
      nds: this.application_nds,
      nsp: this.application_nsp
    };
    var dataForValid = {
      application_sum_wo_discount: this.application_sum_wo_discount,
      application_nds_value: this.application_nds_value,
      application_nsp_value: this.application_nsp_value,
      application_total_sum: this.application_total_sum,
      application_discount_percentage: this.application_discount_percentage,
      application_discount_value: this.application_discount_value,
      application_nds: this.application_nds,
      application_nsp: this.application_nsp
    };

    const { isValid, errors } = await validate(dataForValid);
    if (!isValid) {
      this.errors = errors;
      console.log(errors)
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }
    try {
      MainStore.changeLoader(true);
      let response = await saveApplicationTotalSum(data);
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changeDepartments(ids: number[]) {
    this.structures_ids = ids;
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.pageNumber = page;
      this.pageSize = pageSize;
    });
    this.loadapplication_payments();
  };

  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.sort_by = null;
        this.sort_type = null;
      } else {
        this.sort_by = sortModel[0].field;
        this.sort_type = sortModel[0].sort;
      }
    });
    this.loadapplication_payments();
  };

  async loadapplication_payments() {

    var data = {
      dateStart: this.startDate,
      dateEnd: this.endDate,
      structures_id: this.structures_ids,
    }

    try {
      MainStore.changeLoader(true);
      const response = this.forApplication ? await getapplication_paymentsByapplication_id(this.idMain) : await getapplication_paymentssum(data);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        if (this.forApplication) {
          this.data = response.data;
        } else {
          this.data = response.data.items;
        }
        let totalSum = 0;
        this.data.forEach((x) => {
          totalSum += x.sum
        })
        this.totalSum = Math.round((totalSum) * 100) / 100
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadApplicationSum() {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationSumByApplication_id(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_sum_wo_discount = response.data.sum_wo_discount;
        this.application_nds_value = response.data.nds_value;
        this.application_nsp_value = response.data.nsp_value;
        this.application_total_sum = response.data.total_sum;
        this.application_discount_value = response.data.discount_value;
        this.application_discount_percentage = response.data.discount_percentage;
        this.application_is_percentage = (response.data.discount_value !=null && response.data.discount_value > 0) || (response.data.discount_percentage !=null && response.data.discount_percentage > 0) 
        this.calculateSum();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  handleApplicationSumChangeNumber(event) {
    let { name, value } = event.target;
    if (!value) {
      value = 0;
    }
    value -= 0;
    (this as any)[name] = value;
    this.validateField(name, value);
    this.calculateSum();
  }

  handleApplicationSumChange(event) {
    let { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
    this.calculateSum();
  }
  async calculateSum() {
    // Выделяем сумму без налогов (НДС 12% + НСП 2% = 14%)
    let baseSumWithoutTaxes = this.application_sum_wo_discount / 1.14;

    let discountValue = 0;
    if (this.application_is_percentage) {
      this.application_discount_value = 0;
      this.application_discount_percentage_value = this.application_discount_percentage / 100.0 * baseSumWithoutTaxes;
      discountValue = this.application_discount_percentage_value;
    } else {
      this.application_discount_percentage = 0;
      this.application_discount_percentage_value = 0;
      discountValue = this.application_discount_value;
    }

    // Применяем скидку к цене без налогов
    let discountedBaseSum = baseSumWithoutTaxes - discountValue;
    if (discountedBaseSum < 0) discountedBaseSum = 0; // Предотвращаем отрицательную сумму

    // Рассчитываем налоги после применения скидки
    let ndsValue = this.application_disable_nds ? 0 : (discountedBaseSum * 0.12);
    let nspValue = this.application_disable_nsp ? 0 : (discountedBaseSum * 0.02);

    // Итоговая сумма с налогами
    this.application_nds_value = Math.round(ndsValue * 100) / 100.0;
    this.application_nsp_value = Math.round(nspValue * 100) / 100.0;
    this.application_total_sum = Math.round((discountedBaseSum + ndsValue + nspValue) * 100) / 100.0;
    this.application_sum_wo_discount_and_tax = Math.round(baseSumWithoutTaxes * 100) / 100.0;
  }




  async validateField(name: string, value: any,) {
    let subValue = {
      application_sum_wo_discount: (this.application_sum_wo_discount ?? 0) - 0,
      application_discount_percentage: (this.application_discount_percentage ?? 0) - 0,
      application_discount_value: (this.application_discount_value ?? 0) - 0,
    }
    const { isValid, error } = await validateField(name, value, subValue);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  loadCustomerDiscount = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerDiscountByIdApplication(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.customer_discount = response.data;
        this.is_show_discount = (response.data?.active_discount_count ?? 0) > 0;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async load_structures() {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  signApplicationPayment(id: number, fileId: number) {
    MainStore.digitalSign.fileId = fileId;
    MainStore.openDigitalSign(
      fileId,
      async () => {
        await storeList.loadapplication_payments();
        MainStore.onCloseDigitalSign();
      },
      () => MainStore.onCloseDigitalSign(),
    );
  };

  deleteapplication_payment(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async (reason?: string) => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteapplication_payment(id, reason);
          if (response.status === 201 || response.status === 200) {
            this.loadapplication_payments();
            this.loadApplicationSum();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
            workDocumentStore.loadApplicationWorkDocumentsByTask(store.idTask)
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
      () => MainStore.onCloseConfirm(),
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );
  };

  loadorg_structures = async (idStructure?: number) => {
    try {
      MainStore.changeLoader(true);

      if (
        idStructure == 239 ||
        idStructure == 240 ||
        idStructure == 241 ||
        idStructure == 224 ||
        idStructure == 242
      ) {
        const response = await getorg_structures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data.filter(x =>

            x.id == 239 ||
            x.id == 240 ||
            x.id == 241 ||
            x.id == 224 ||
            x.id == 242
          )
        } else {
          throw new Error();
        }
      } else {
        const response = await getMyOrgStructures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data
        } else {
          throw new Error();
        }
      }

    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadorg_structuresAll = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data.filter(x => x.id == 239 ||
          x.id == 240 ||
          x.id == 241 ||
          x.id == 224 ||
          x.id == 242)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadUserOrgStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyOrgStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.first_user_structure_id = response.data[0]?.id;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changeDateStart(date: Dayjs) {
    this.startDate = date;
  }

  changeDateEnd(date: Dayjs) {
    this.endDate = date;
  }

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.first_user_structure_id = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.startDate = dayjs();
      this.endDate = dayjs();
      this.structures_ids = []
      this.forApplication = false;
      this.errors_startDate = "";
      this.application_sum_wo_discount = 0;
      this.application_nds_value = 0;
      this.application_nsp_value = 0;
      this.application_total_sum = 0;
      this.application_is_percentage = false;
      this.application_discount_percentage = 0;
      this.application_discount_value = 0;
      this.application_discount_percentage_value = 0;
      this.application_disable_nds = false;
      this.application_nds = 0;
      this.application_disable_nsp = false;
      this.application_nsp = 0;
      this.isDiscountForm = false;
    });
  };

  clearFilter() {
    this.startDate = dayjs();
    this.endDate = dayjs();
    this.structures_ids = []
  }
}

export default new NewStore();
