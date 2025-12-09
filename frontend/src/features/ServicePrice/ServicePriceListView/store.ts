import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getServicePrices, deleteServicePrice, getServicePricesByStructure } from "api/ServicePrice";
import mainStore from "MainStore";
import LayoutStore from "../../../layouts/MainLayout/store";

class NewStore {
  data = [];
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

  loadServicePrices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = MainStore.isHeadStructure && LayoutStore.head_of_structures[0]?.id > 0 ? await getServicePricesByStructure(LayoutStore.head_of_structures[0]?.id) : await getServicePrices() ;
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

  deleteServicePrice = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteServicePrice(id);
          if (response.status === 201 || response.status === 200) {
            this.loadServicePrices();
            MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
          }  else {
            throw new Error();
          }
        } catch (err) {
          mainStore.openErrorDialog(i18n.t("message:error.documentIsAlreadyInUse"))
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
