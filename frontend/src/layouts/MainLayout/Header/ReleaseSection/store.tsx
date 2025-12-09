import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { getrelease, getReleaseds, getreleases } from "api/release";


class NewStore {
  data = []
  release = null;
  openPanel = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.data = []
      this.release = null;
    });
  }

  changePanel(flag: boolean) {
    this.openPanel = flag
    if (flag) {
      this.loadreleases()
    } else {
      this.clearStore()
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }

  backClicked(){
    this.release = null;
  }

  loadreleases = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getReleaseds();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadrelease = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getrelease(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.release = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };



}

export default new NewStore();
