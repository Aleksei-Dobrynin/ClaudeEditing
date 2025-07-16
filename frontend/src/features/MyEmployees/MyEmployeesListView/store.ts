import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getEmployeeInMyStructure, getEmployeeInMyStructureHistory,
  getEmployeeInStructureByService,
  getEmployeeInStructures
} from "api/EmployeeInStructure/useGetEmployeeInStructures";
import { deleteEmployeeInStructure, fireEmployeeInStructure } from "api/EmployeeInStructure/useDeleteEmployeeInStructure";
import { getEmployeeByEmail } from "../../../api/Employee/useGetEmployeeByEmail";
import { getEmployeeByToken } from "../../../api/Employee/useGetGetEmployeeByToken";
import { getEmployeeByIdUser } from "../../../api/Employee/useGetEmployeeByUserId";

class NewStore {
  data = [];
  EmployeeInStructure = [];
  openPanel = false;
  currentId = 0;
  idStructure = 0;

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
      const response = await getEmployeeInMyStructure();
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
  loadEmployeeInStructuresByStructureHistory = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInMyStructureHistory();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        console.log("!!")
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

  fireEmployeeInStructure = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("Вы точно хотите уваолить сотрудника?"),
      i18n.t("Уволить"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await fireEmployeeInStructure(id);
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
