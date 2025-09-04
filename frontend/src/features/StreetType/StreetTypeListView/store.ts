import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getStreetTypes, getStreetTypesPagination, deleteStreetType } from "api/StreetType";
import { GridSortModel } from "@mui/x-data-grid";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;

  pageSize = 10;
  pageNumber = 0;
  orderType = null;
  orderBy = null;
  totalCount = 0;

  constructor() {
    makeAutoObservable(this);
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.pageNumber = page;
      this.pageSize = pageSize;
    });
    this.loadStreetTypes();
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
    this.loadStreetTypes();
  };

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

  loadStreetTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStreetTypesPagination(this.pageSize, this.pageNumber, this.orderBy, this.orderType);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.data = response.data.items;
          this.totalCount = response.data.totalCount;
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteStreetType = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteStreetType(id);
          if (response.status === 201 || response.status === 200) {
            this.loadStreetTypes();
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