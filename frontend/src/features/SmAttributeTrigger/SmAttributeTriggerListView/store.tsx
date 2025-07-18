import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSmAttributeTriggersByProjectId } from "api/SmAttributeTrigger/useGetSmAttributeTriggersByProjectId";
import { deleteSmAttributeTrigger } from "api/SmAttributeTrigger/useDeleteSmAttributeTrigger";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  project_id = 0;
  isEdit = false;


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

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value
  }


  loadSmAttributeTriggers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmAttributeTriggersByProjectId(this.project_id);
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

  deleteSmAttributeTrigger = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteSmAttributeTrigger(id);
          if (response.status === 201 || response.status === 200) {
            this.loadSmAttributeTriggers();
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

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.project_id = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
