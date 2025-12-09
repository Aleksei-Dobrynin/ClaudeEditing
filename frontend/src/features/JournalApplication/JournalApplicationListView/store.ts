import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getJournalApplications,
  deleteJournalApplication,
  getJournalApplicationsPagination
} from "api/JournalApplication";
import { getDocumentJournalss } from "../../../api/DocumentJournals";
import { validate } from "../../DocumentJournals/DocumentJournalsAddEditView/valid";
import { GridSortModel } from "@mui/x-data-grid";

class NewStore {
  data = [];
  Journals = [];
  journals_id = 0;
  page = 0;
  pageSize = 10;
  totalCount = 0;
  orderBy = null;
  orderType = null;
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

  loadJournalApplications = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getJournalApplicationsPagination(this.page, this.pageSize, this.orderBy, this.orderType, this.journals_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.data = response.data.items;
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

  loadDocumentJournalss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDocumentJournalss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Journals = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  handleChange(event) {
    this[event.target.name] = event.target.value;
    this.loadJournalApplications()
  }

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.page = page;
      this.pageSize = pageSize;
    })
    this.loadJournalApplications()
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
    this.loadJournalApplications()
  }

  deleteJournalApplication = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteJournalApplication(id);
          if (response.status === 201 || response.status === 200) {
            this.loadJournalApplications();
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
      this.Journals = [];
      this.journals_id = 0;
      this.page = 0;
      this.pageSize = 10;
      this.totalCount = 0;
      this.orderBy = null;
      this.orderType = null;
      this.currentId = 0;
      this.openPanel = false;
    });
  };
}

export default new NewStore();