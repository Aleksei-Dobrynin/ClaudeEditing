import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsFooterCommsId } from "api/TemplCommsFooter/useGetTemplCommsFooterByCommsId";
import { deleteTemplCommsFooter } from "api/TemplCommsFooter/useDeleteTemplCommsFooter";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  template_comms_id = 0;
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

  loadTemplCommsFooters = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsFooterCommsId(this.template_comms_id);
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

  deleteTemplCommsFooter = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTemplCommsFooter(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTemplCommsFooters();
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
      this.template_comms_id = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
