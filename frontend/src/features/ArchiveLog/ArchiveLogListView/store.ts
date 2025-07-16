import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { changeArchiveLogStatus, getArchiveLogs, getArchiveLogsByFilter } from "api/ArchiveLog/useGetArchiveLogs";
import { deleteArchiveLog } from "api/ArchiveLog/useDeleteArchiveLog";
import { getEmployeeInStructures } from "../../../api/EmployeeInStructure/useGetEmployeeInStructures";
import { getEmployees } from "../../../api/Employee/useGetEmployees";
import { getArchiveLogStatuss } from "../../../api/ArchiveLogStatus/useGetArchiveLogStatuss";

class NewStore {
  data = [];
  employees = [];
  ArchiveLogStatuses = [];
  filter = {
    doc_number: '',
    employee_id: 0
  };
  openPanel = false;
  openReturnPanel = false;
  currentId = 0;
  

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  clearFilter() {
    this.filter = {
      doc_number: '',
      employee_id: 0
    };
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  onOpenReturnPanel(id: number) {
    runInAction(() => {
      this.openReturnPanel = true;
      this.currentId = id;
    });
  }

  onCloseReturnPanel() {
    runInAction(() => {
      this.openReturnPanel = false;
      this.currentId = 0;
    });
  }

  loadArchiveLogs = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogs();
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

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveLogStatuses = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadArchiveLogsByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogsByFilter(this.filter);
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

  loadEmployees = async () => {
    try {
      const response = await getEmployees();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.employees = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  changeStatusArchiveLog = (idElement: number, idStatus: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("confirm"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await changeArchiveLogStatus(idElement, idStatus);
          if (response.status === 201 || response.status === 200) {
            this.loadArchiveLogs();
            MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"));
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

  deleteArchiveLog = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteArchiveLog(id);
          if (response.status === 201 || response.status === 200) {
            this.loadArchiveLogs();
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
      this.filter = null;
    });
  };
}

export default new NewStore();
