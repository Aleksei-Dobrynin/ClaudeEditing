import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getEmployeeInStructureByService,
  getEmployeeInStructures
} from "api/EmployeeInStructure/useGetEmployeeInStructures";
import { deleteEmployeeInStructure } from "api/EmployeeInStructure/useDeleteEmployeeInStructure";
import dayjs from "dayjs";

class NewStore {
  data = [];
  EmployeeInStructure = [];
  openPanel = false;
  currentId = 0;
  idStructure = 0;
  originData = [];
  Checked = false;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }
  changeChecked(){
    runInAction(() => {
    this.Checked = !this.Checked;
    });
  }

  changeEmployeeActiveOrAll() {

    runInAction(() => {
    if(this.Checked) {
      this.data = [...this.data.filter( employee => !dayjs(employee.date_end).isBefore(dayjs(new Date())))];
    }
    else  {
      this.data = [...this.originData];
    }
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
      const response = await getEmployeeInStructureByService(this.idStructure);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        this.originData = response.data;
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
