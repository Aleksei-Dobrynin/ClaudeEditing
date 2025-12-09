import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletereestr, getMyreestrs, setApplicationToReestr } from "api/reestr";
import { getreestrs } from "api/reestr";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  showMyOnly = false; // По умолчанию показываем все заявки


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

  // Метод для изменения фильтра
  setShowMyOnly = (value: boolean) => {
    this.showMyOnly = value;
    // Перезагружаем данные с новым фильтром
    this.loadreestrs();
  }

  async setApplicationToReestr(application_id: number, reestr_id: number, callback?: (reestr_id: number) => void) {
    try {
      MainStore.changeLoader(true);
      const response = await setApplicationToReestr(application_id, reestr_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        callback?.(reestr_id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadreestrs() {
    try {
      MainStore.changeLoader(true);
      // Выбираем API в зависимости от состояния фильтра
      const response = this.showMyOnly 
        ? await getMyreestrs()  // Мои заявки
        : await getreestrs();   // Все заявки
      
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

  deletereestr(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletereestr(id);
          if (response.status === 201 || response.status === 200) {
            this.loadreestrs();
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