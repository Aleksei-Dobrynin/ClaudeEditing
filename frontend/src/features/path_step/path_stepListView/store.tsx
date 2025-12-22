import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletepath_step } from "api/path_step";
import { getpath_stepsBypath_id } from "api/path_step";
import buffer from "../../service_path/service_pathAddEditView/store";

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

  async loadpath_steps(){
    try {
      MainStore.changeLoader(true);
      const response = await getpath_stepsBypath_id(this.idMain);
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

  deletepath_step(id: number){
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          buffer.addBuffer({ entity: "path_step", kind: "delete", id });
          //const response = await deletepath_step(id);
          // if (response.status === 201 || response.status === 200) {
          //   this.loadpath_steps();
          //   MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
          // } else {
          //   throw new Error();
          // }
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


  get effectiveData() {
    const result = [...this.data];

    const changes = (buffer.bufferList ?? []).filter(
      (x) => x.entity === "path_step"
    );

    const deletes = changes.filter((x) => x.kind === "delete" && x.id != null);
    for (const d of deletes) {
      const idx = result.findIndex((r: any) => r.id === d.id);
      if (idx !== -1) {
        result.splice(idx, 1);
      }
    }

    const updates = changes.filter((x) => x.kind === "update" && x.id != null);
    for (const u of updates) {
      const idx = result.findIndex((r: any) => r.id === u.id);
      if (idx !== -1) {
        result[idx] = {
          ...result[idx],
          ...(u.payload || {}),
        };
      }
    }

    const adds = changes.filter((x) => x.kind === "add");
    for (const a of adds) {
      const payload = a.payload || {};
      result.push({
        ...payload,
        id: a.id, // временный отрицательный id
      });
    }

    return result;
  }

  clearStore(){
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
