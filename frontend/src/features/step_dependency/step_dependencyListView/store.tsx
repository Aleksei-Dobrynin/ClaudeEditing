import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletestep_dependency } from "api/step_dependency";
import { getstep_dependencies } from "api/step_dependency";
import { getstep_dependenciesByFilter } from "api/step_dependency";
import { getservice_paths } from "api/service_path";

class NewStore {
  data = [];
  service_paths = [];
  filter = {
    service_path_id: 0
  };
  dependent_step_id = 0;
  prerequisite_step_id = 0;
  openPanel = false;
  currentId = 0;
  idMain = 0;
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

  clearFilter() {
    this.filter = {
      service_path_id: 0
    };
  }

  async loadstep_dependencies(){
    try {
      MainStore.changeLoader(true);
      const response = await getstep_dependencies();
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

  loadstep_dependenciesByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getstep_dependenciesByFilter(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        if (this.dependent_step_id && this.dependent_step_id !== 0) {
          this.data = response.data.filter(item => item.dependent_step_id === this.dependent_step_id);
        }
        if (this.prerequisite_step_id && this.prerequisite_step_id !== 0) {
          this.data = this.data.filter(item => item.prerequisite_step_id === this.prerequisite_step_id);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadservice_paths = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getservice_paths();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.service_paths = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deletestep_dependency(id: number){
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletestep_dependency(id);
          if (response.status === 201 || response.status === 200) {
            this.loadstep_dependencies();
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

  clearStore(){
    runInAction(() => {
      this.data = [];
      this.service_paths = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.filter = {
        service_path_id: 0
      };
      this.dependent_step_id = 0;
      this.prerequisite_step_id = 0;
    });
  };
}

export default new NewStore();