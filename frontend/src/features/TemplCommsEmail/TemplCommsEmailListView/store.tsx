import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTemplCommsEmailCommsId } from "api/TemplCommsEmail/useGetTemplCommsEmailByCommsId";
import { deleteTemplCommsEmail } from "api/TemplCommsEmail/useDeleteTemplCommsEmail";

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

  loadTemplCommsEmails = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTemplCommsEmailCommsId(this.template_comms_id);
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

  deleteTemplCommsEmail = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTemplCommsEmail(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTemplCommsEmails();
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
