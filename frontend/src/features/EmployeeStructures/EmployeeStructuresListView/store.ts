import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getEmployeeInStructures
} from "api/EmployeeInStructure/useGetEmployeeInStructures";
import {
  getEmployeeStructures
} from "api/EmployeeInStructure/useGetEmployeeStructures";
import { deleteEmployeeInStructure } from "api/EmployeeInStructure/useDeleteEmployeeInStructure";

class NewStore {
  data = [];
  EmployeeInStructure = [];
  openPanel = false;
  currentId = 0;
  idEmployee = 0;

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

  loadEmployeeInStructuresByStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeStructures(this.idEmployee);
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

  loadEmployeeInStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructures();
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

  deleteEmployeeInStructure = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteEmployeeInStructure(id);
          if (response.status === 201 || response.status === 200) {
            this.loadEmployeeInStructuresByStructure();
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
