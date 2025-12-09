import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletearchive_objects_event } from "api/ArchiveObjectEvents";
import { getArchiveObjectsEvents, getArchiveObjectsEventsByObjectId } from "api/ArchiveObjectEvents";

class NewStore {
  data = [];
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

  async loadArchiveObjectsEvents() {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectsEvents();
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

  async loadArchiveObjectsEventsByObjectId(objectId: number) {
    try {
      MainStore.changeLoader(true);
      // Assuming you have an API endpoint that filters by archive_object_id
      const response = await getArchiveObjectsEventsByObjectId(objectId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else if (response.status === 204) {
        // No content - no events for this object
        this.data = [];
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deletearchive_objects_event(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deletearchive_objects_event(id);
          if (response.status === 201 || response.status === 200) {
            if (this.idMain > 0) {
              this.loadArchiveObjectsEventsByObjectId(this.idMain);
            } else {
              this.loadArchiveObjectsEvents();
            }
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

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();