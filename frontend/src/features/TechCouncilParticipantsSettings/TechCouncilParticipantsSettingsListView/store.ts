import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getTechCouncilParticipantsSettingss,
  deleteTechCouncilParticipantsSettings,
  getTechCouncilParticipantsSettings, getTechCouncilParticipantsSettingsByServiceId
} from "api/TechCouncilParticipantsSettings";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idService = 0;

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

  loadTechCouncilParticipantsSettingss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilParticipantsSettingsByServiceId(this.idService);
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

  deleteTechCouncilParticipantsSettings = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTechCouncilParticipantsSettings(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTechCouncilParticipantsSettingss();
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
      this.idService = 0;
    });
  };
}

export default new NewStore();