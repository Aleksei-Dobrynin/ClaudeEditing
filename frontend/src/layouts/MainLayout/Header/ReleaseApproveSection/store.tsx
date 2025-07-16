import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { approveRelease, getLastRelease, getrelease, getReleaseds, getreleases } from "api/release";


class NewStore {
  release = null;
  openPanel = false;
  checked = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.release = null;
      this.checked = false;
    });
  }

  changePanel(flag: boolean) {
    this.openPanel = flag
    if (flag) {
      this.loadlastRelease()
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }

  backClicked() {
    this.release = null;
  }

  loadlastRelease = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLastRelease();
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

  approveRelease = async () => {
    if (this.release == null) return;
    try {
      MainStore.changeLoader(true);
      const response = await approveRelease(this.release?.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.changePanel(false)
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
