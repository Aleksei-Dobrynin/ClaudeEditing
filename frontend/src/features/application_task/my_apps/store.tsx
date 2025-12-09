import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  deleteapplication_task,
  getapplication_tasks,
  getMyApplications,
  getMyTasks,
  getStructureTasks
} from "api/application_task";
import dayjs, { Dayjs } from "dayjs";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  my_tasks: boolean = false;
  searchField = ""
  date_start = dayjs().add(-1, 'month').format('YYYY-MM-DDTHH:mm:ss')
  date_end = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  isExpiredTasks = false;
  isResolwedTasks = false;


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
  }

  changeSearch = (value: string) => {
    this.searchField = value
  }
  changeDateStart = (value: Dayjs) => {
    if (value != null) {
      this.date_start = value.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.date_start = null
    }
  }
  changeDateEnd = (value: Dayjs) => {
    if (value != null) {
      this.date_end = value.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.date_end = null
    }
  }

  async loadapplication_tasks() {
    try {
      MainStore.changeLoader(true);
      const response = await getMyApplications();
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

  deleteapplication_task(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteapplication_task(id);
          if (response.status === 201 || response.status === 200) {
            this.loadapplication_tasks();
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
  };

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.searchField = ""
    });
  };
}

export default new NewStore();
