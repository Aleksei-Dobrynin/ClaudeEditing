import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { GridSortModel } from "@mui/x-data-grid";
import { getTemplTemplateCommss } from "api/TemplTemplateComms/useGetTemplTemplateCommss";
import { deleteTemplTemplateComms } from "api/TemplTemplateComms/useDeleteTemplTemplateComms";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  page = 0;
  pageSize = 10;
  totalCount = 0;
  orderBy = null;
  orderType = null;
  searchText = null;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    })
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    })
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.page = page;
      this.pageSize = pageSize;
    })
    this.loadTemplTemplateCommss()
  }
  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.orderBy = null;
        this.orderType = null;
      } else {
        this.orderBy = sortModel[0].field;
        this.orderType = sortModel[0].sort;
      }
    })
    this.loadTemplTemplateCommss()
  }
  changeSearchText = (searchText: string) => {
    this.searchText = searchText
    this.loadTemplTemplateCommss()
  }

  loadTemplTemplateCommss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplTemplateCommss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.data = response.data.data;
          this.totalCount = response.data.total_count
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

  deleteTemplTemplateComms = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTemplTemplateComms(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTemplTemplateCommss();
            MainStore.setSnackbar(i18n.t("message:deletedSuccessfully"));
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
      this.page = 0;
      this.pageSize = 10;
      this.totalCount = 0;
      this.orderBy = null;
      this.orderType = null;
      this.searchText = null;
    });
  };
}

export default new NewStore();
