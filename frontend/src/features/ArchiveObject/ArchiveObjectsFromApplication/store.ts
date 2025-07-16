import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getArchiveObjectPagination,
  getArchiveObjects,
  getArchitectureProcess
} from "api/ArchiveObject/useGetArchiveObjects";
import { deleteArchiveObject } from "api/ArchiveObject/useDeleteArchiveObject";
import { getArchiveLogsByFilter } from "../../../api/ArchiveLog/useGetArchiveLogs";
import { GridSortModel } from "@mui/x-data-grid";
import { getarchitecture_process, getarchitecture_processes, getarchitecture_processesToArchive } from "api/architecture_process";

class NewStore {
  data = [];
  totalCount = 0;
  filter = {
    search: '',
    pageSize: 100,
    pageNumber: 0,
    sort_by: null,
    sort_type: null,
  };
  toArchive = false;
  openPanel = false;
  currentId = 0;

  constructor() {
    makeAutoObservable(this);
  }

  clearFilter() {
    this.filter = {
      search: '',
      pageSize: 100,
      pageNumber: 0,
      sort_by: null,
      sort_type: null,
    };
  }

  loadArchiveObjectsByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectPagination(this.filter);
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

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.filter.pageNumber = page;
      this.filter.pageSize = pageSize;
    });
    this.loadArchiveObjectsByFilter();
  };

  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.filter.sort_by = null;
        this.filter.sort_type = null;
      } else {
        this.filter.sort_by = sortModel[0].field;
        this.filter.sort_type = sortModel[0].sort;
      }
    });
    this.loadArchiveObjectsByFilter();
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

  loadArchiveObjects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = this.toArchive ?  await getarchitecture_processesToArchive() : await getarchitecture_processes();
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

  deleteArchiveObject = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteArchiveObject(id);
          if (response.status === 201 || response.status === 200) {
            this.loadArchiveObjects();
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
