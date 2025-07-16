import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletelegal_act_registry } from "api/legal_act_registry";
import { getlegal_act_registries, getlegal_act_registriesByAddress,getlegal_act_registriesByFilter } from "api/legal_act_registry";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  address = ""
  filter = {
    commonFilter: '',
  };


  clearFilter() {
    this.filter = {
      commonFilter: '',
    };
  }

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


  async loadlegal_act_registries() {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registries();

      if (this.address != "" && this.address != undefined) {
        const response = await getlegal_act_registriesByAddress(this.address);

      }
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
  async loadlegal_act_registriesByAddress(address: string) {
    try {
      MainStore.changeLoader(true);
        const response = await getlegal_act_registriesByAddress(address);
    
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

  loadlegal_act_registriesByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registriesByFilter(this.filter);
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

  deletelegal_act_registry(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletelegal_act_registry(id);
          if (response.status === 201 || response.status === 200) {
            this.loadlegal_act_registries();
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
    });
  };
}

export default new NewStore();
