import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletecontragent_interaction, getcontragent_interactions_filter } from "api/contragent_interaction";
import { getcontragent_interactions } from "api/contragent_interaction";
import { Dayjs } from "dayjs";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  pin = "";
  address = "";
  number = "";
  date_start = null;
  date_end = null;

  isEdit = false;


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


  changePin (value: string) {
    this.pin = value;
  }
  changeAddress (value: string) {
    this.address = value;
  }
  changeNumber (value: string) {
    this.number = value;
  }
  changeDateStart (value: Dayjs) {
    this.date_start = value;
  }
  changeDateEnd (value: Dayjs) {
    this.date_end = value;
  }
  clearFilter() {
    this.pin = "";
    this.address = "";
    this.number = "";
    this.date_start = null;
    this.date_end = null;
  }

  async loadcontragent_interactions() {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interactions_filter(this.pin, this.number, this.address, this.date_start, this.date_end);
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

  deletecontragent_interaction(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletecontragent_interaction(id);
          if (response.status === 201 || response.status === 200) {
            this.loadcontragent_interactions();
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
      this.isEdit = false;
    });
  };
}

export default new NewStore();
