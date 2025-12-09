import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomerRepresentatives, getCustomerRepresentativesByCustomer } from "api/CustomerRepresentative/useGetCustomerRepresentatives";
import { deleteCustomerRepresentative } from "api/CustomerRepresentative/useDeleteCustomerRepresentative";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  customer_id = 0;
  isEdit =false;
  editIndex = 0;

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

  loadCustomerRepresentatives = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerRepresentatives();
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

  loadCustomerRepresentativesByCustomer = async (customerId = this.customer_id) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerRepresentativesByCustomer(customerId);
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

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  deleteCustomerRepresentative = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteCustomerRepresentative(id);
          if (response.status === 201 || response.status === 200) {
            this.loadCustomerRepresentativesByCustomer();
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
