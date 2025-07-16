import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomerDiscountDocumentsByIdCustomer, deleteCustomerDiscountDocuments } from "api/CustomerDiscountDocuments";
import { getDiscountDocumentss } from "api/DiscountDocuments";

class NewStore {
  data = [];
  customer_id = 0;
  openPanel = false;
  currentId = 0;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  loadCustomerDiscountDocumentss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerDiscountDocumentsByIdCustomer(this.customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteCustomerDiscountDocuments = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteCustomerDiscountDocuments(id);
          if (response.status === 201 || response.status === 200) {
            this.loadCustomerDiscountDocumentss();
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
    });
  };
}

export default new NewStore();
