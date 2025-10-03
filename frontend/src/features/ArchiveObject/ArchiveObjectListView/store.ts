import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getArchiveObjectPagination,
  getArchiveObjects,
} from "api/ArchiveObject/useGetArchiveObjects";
import { deleteArchiveObject } from "api/ArchiveObject/useDeleteArchiveObject";
import { getArchiveLogsByFilter } from "../../../api/ArchiveLog/useGetArchiveLogs";
import { GridSortModel } from "@mui/x-data-grid";
import { getarchitecture_statuses } from "api/architecture_status";
import { getCustomersForArchiveObject } from "api/CustomersForArchiveObject/CustomersForArchiveObject";
import { combineArchiveObjects } from "api/ArchiveObject/useCreateArchiveObject";

interface SelectedObject {
  id: number;
  doc_number: string;
  address: string;
}

class NewStore {
  data = [];
  customers = [];
  totalCount = 0;
  filter = {
    search: "",
    pageSize: 100,
    pageNumber: 0,
    sort_by: null,
    sort_type: null,
    status_id: 0,
    created_at_from: null,
    created_at_to: null,
    updated_at_from: null,
    updated_at_to: null,
  };
  openPanel = false;
  currentId = 0;
  ArchitectureStatuses = [];
  focus_id = null;

  // Объединение объектов
  combineObjectsMode = false;
  selectedObjects: SelectedObject[] = [];
  showCombinePopup = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearFilter() {
    this.filter = {
      search: "",
      pageSize: 100,
      pageNumber: 0,
      sort_by: null,
      sort_type: null,
      status_id: 0,
      created_at_from: null,
      created_at_to: null,
      updated_at_from: null,
      updated_at_to: null,
    };
  }

  // Методы для объединения объектов
  toggleCombineMode = () => {
    this.combineObjectsMode = !this.combineObjectsMode;
    if (!this.combineObjectsMode) {
      this.selectedObjects = [];
    }
  };

  showOnMap = (id: number) => {
    this.focus_id = id;
  };

  clearMapFocus = () => {
    this.focus_id = null;
  };

  selectObjectForCombine = (obj: any) => {
    const selectedObj: SelectedObject = {
      id: obj.id,
      doc_number: obj.doc_number,
      address: obj.address,
    };

    const existingIndex = this.selectedObjects.findIndex((item) => item.id === obj.id);

    if (existingIndex >= 0) {
      // Убираем из выбранных
      this.selectedObjects.splice(existingIndex, 1);
    } else {
      // Добавляем в выбранные
      this.selectedObjects.push(selectedObj);
    }
  };

  isObjectSelected = (id: number): boolean => {
    return this.selectedObjects.some((obj) => obj.id === id);
  };

  removeSelectedObject = (id: number) => {
    const index = this.selectedObjects.findIndex((obj) => obj.id === id);
    if (index >= 0) {
      this.selectedObjects.splice(index, 1);
    }
  };

  canCombineObjects = (): boolean => {
    return this.selectedObjects.length >= 2;
  };

  // Открыть попап подтверждения объединения
  openCombinePopup = () => {
    if (!this.canCombineObjects()) {
      MainStore.setSnackbar("Выберите минимум 2 объекта для объединения", "error");
      return;
    }
    this.showCombinePopup = true;
  };

  // Закрыть попап
  closeCombinePopup = () => {
    this.showCombinePopup = false;
  };

  combineObjects = async (newDocNumber: string, newAddress: string) => {
    try {
      MainStore.changeLoader(true);

      const objectIds = this.selectedObjects.map((obj) => obj.id);
      const response = await combineArchiveObjects(objectIds, newDocNumber, newAddress);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const result = await response.data;
        MainStore.setSnackbar(
          `Объекты успешно объединены. Создан объект: ${newDocNumber}`,
          "success"
        );

        // Закрыть попап и сбросить режим объединения
        this.showCombinePopup = false;
        this.combineObjectsMode = false;
        this.selectedObjects = [];

        // Перезагрузить список
        this.loadArchiveObjects();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при объединении объектов");
      }

    } catch (err) {
      console.error("Combine objects error:", err);
      MainStore.setSnackbar(err.message || i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  cancelCombineMode = () => {
    this.combineObjectsMode = false;
    this.selectedObjects = [];
  };

  loadArchiveObjectsByFilter = async () => {
    try {
      MainStore.changeLoader(true);
      this.filter.pageSize = 25000; //TODO
      const response = await getArchiveObjectPagination(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data.items;
        this.totalCount = response.data.totalCount;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.filter.pageNumber = page;
      this.filter.pageSize = pageSize;
    });
    this.loadArchiveObjectsByFilter();
  };

  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.filter.sort_by = null;
        this.filter.sort_type = null;
      } else {
        this.filter.sort_by = sortModel[0].field;
        this.filter.sort_type = sortModel[0].sort;
      }
    });
    this.loadArchiveObjectsByFilter();
  };

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

  loadArchiveObjects = async () => {
    try {
      MainStore.changeLoader(true);
      this.filter.pageSize = 25000; //TODO
      const response = await getArchiveObjectPagination(this.filter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data.items;
        this.totalCount = response.data.totalCount;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomersForArchiveObjects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomersForArchiveObject();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.customers = response.data;
        console.log(this.customers, "this.data");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  doload() {
    this.loadArchiveObjects();
    this.loadArchitectureStatuses();
    this.loadCustomersForArchiveObjects();
  }

  loadArchitectureStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchitectureStatuses = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteArchiveObject = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteArchiveObject(id);
          if (response.status === 201 || response.status === 200) {
            this.loadArchiveObjects();
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
      // this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.combineObjectsMode = false;
      this.selectedObjects = [];
    });
  };
}

export default new NewStore();
