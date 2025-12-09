import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
// import { deletenotification } from "api/notification";
import { getnotificationLogs, getNotificationLogsBySearch } from "api/notificationLog";
import { GridSortModel } from "@mui/x-data-grid";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  search = '';
  pageSize = 100;
  pageNumber = 0;
  totalCount = 0;
  showOnlyFailed = false;

  constructor() {
    makeAutoObservable(this);
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.pageNumber = page;
      this.pageSize = pageSize;
    });
    this.loadnotifications();
  };


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
  }

  async loadnotifications() {
    try {
      MainStore.changeLoader(true);
      const response = await getNotificationLogsBySearch(this.search, this.showOnlyFailed, this.pageNumber, this.pageSize);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data.items;
        this.totalCount = response.data.totalCount;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deletenotification(id: number) {
    //palceholder
  };

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
