import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getEmployees } from "api/Employee/useGetEmployees";
import { deleteEmployee } from "api/Employee/useDeleteEmployee";

class NewStore {
  data = [];
  mainData = [];
  openPanel = false;
  currentId = 0;
  searchField = "";

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }
  changeSearch = (value: string) => {
    this.searchField = value
  }

  onSearchClicked = () => {
    const data = this.mainData.filter(x => 
      (x?.last_name + ' ' + x?.first_name + ' ' + x?.second_name).toLowerCase().includes(this.searchField?.toLowerCase())
      || x?.email?.toLowerCase().includes(this.searchField?.toLowerCase())
      || x?.user_id?.toLowerCase().includes(this.searchField?.toLowerCase())
    )
    this.data = data;
  }

  clearSearch() {
    this.searchField = "";
    this.loadEmployees()
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  loadEmployees = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployees();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        this.mainData = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteEmployee = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteEmployee(id);
          if (response.status === 201 || response.status === 200) {
            this.loadEmployees();
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
      this.searchField = "";
    });
  };
}

export default new NewStore();
