import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getWorkflowTaskTemplates,
  getWorkflowTaskTemplatesByWorkflow
} from "api/WorkflowTaskTemplate/useGetWorkflowTaskTemplates";
import { deleteWorkflowTaskTemplate } from "api/WorkflowTaskTemplate/useDeleteWorkflowTaskTemplate";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idWorkflow = 0;

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

  loadWorkflowTaskTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplates();
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

  loadWorkflowTaskTemplatesByWorkflow = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplatesByWorkflow(this.idWorkflow);
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

  deleteWorkflowTaskTemplate = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteWorkflowTaskTemplate(id);
          if (response.status === 201 || response.status === 200) {
            this.loadWorkflowTaskTemplatesByWorkflow();
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
    });
  };
}

export default new NewStore();
