import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationPaidInvoiceByIDApplication } from "api/ApplicationPaidInvoice/useGetApplicationPaidInvoices";
import { deleteapplication_paid_invoice } from "api/application_paid_invoice";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  totalSum = 0;
  idMain = 0;
  isEdit = false;

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

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  };

  loadApplicationPaidInvoicesByIDApplication = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationPaidInvoiceByIDApplication(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        let totalSum = 0;
        response.data.forEach((x) => {
          totalSum += x.sum;
        });
        this.totalSum = totalSum;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteappication_paid_invoice(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteapplication_paid_invoice(id);
          if (response.status === 201 || response.status === 200) {
            this.loadApplicationPaidInvoicesByIDApplication();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
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
  }

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
    });
  };
}

export default new NewStore();
