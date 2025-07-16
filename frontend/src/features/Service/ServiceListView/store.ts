import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getServices } from "api/Service/useGetServices";
import { deleteService } from "api/Service/useDeleteService";
import mainStore from "MainStore";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  searchField = "";

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

  clearSearch() {
    this.searchField = "";
    this.loadServices()
  }

  changeSearch = (value: string) => {
    this.searchField = value
  }

  onSearchClicked = () => {
    const data = this.data.filter(x =>
      (x?.name).toLowerCase().includes(this.searchField?.toLowerCase())
    )
    this.data = data;
  }

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
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

  deleteService = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteService(id);
          if (response.status === 201 || response.status === 200) {
            this.loadServices();
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
