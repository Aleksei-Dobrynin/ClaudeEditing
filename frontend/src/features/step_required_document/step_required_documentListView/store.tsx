import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deletestep_required_document } from "api/step_required_document";
import { getstep_required_documentsBystep_id } from "api/step_required_document";
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

  async loadstep_required_documents(){
    try {
      MainStore.changeLoader(true);
      const response = await getstep_required_documentsBystep_id(this.idMain);
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

  deletestep_required_document(id: number){
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          // const response = await deletestep_required_document(id);
          buffer.addBuffer({
            entity: "step_required_document",
            kind: "delete",
            id
          });
          // if (response.status === 201 || response.status === 200) {
          //   this.loadstep_required_documents();
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

  clearStore(){
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
    });
  };

  get effectiveData() {
    const result = [...this.data];

    const changes = (buffer.bufferList ?? []).filter(
      (x) => x.entity === "step_required_document"
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
}

export default new NewStore();
