import { runInAction, makeObservable, observable, makeAutoObservable } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSecurityEvents } from "api/SecurityEvent";

class SecurityEventListStore {
  data = [];
  openPanel = false;
  currentId = 0;
  

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
    });
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
  
  loadSecurityEvents = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSecurityEvents();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data?.items;
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

export default new SecurityEventListStore();
