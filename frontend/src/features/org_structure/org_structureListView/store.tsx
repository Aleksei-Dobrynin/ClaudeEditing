import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deleteorg_structure } from "api/org_structure";
import { getorg_structures } from "api/org_structure";
import { getFilledTemplate } from "api/org_structure";
import { org_structure } from "constants/org_structure";
import printJS from 'print-js'

export interface TreeNode {
  id: number;
  name: string;
  short_name: string;
  children: TreeNode[];
}

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idParent = 0;
  idMain = 0;
  isEdit = false;
  treeData: TreeNode[] = [];


  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number, idParent: number) {
    this.openPanel = true;
    this.currentId = id;
    this.idParent = idParent;
  }

  closePanel() {
    this.openPanel = false;
    this.currentId = 0;
  }

  async printDocument(idDocument: number, parameters: {}) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplate(idDocument, 'ru', parameters);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: 'raw-html',
          targetStyles: ['*']
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  buildTree = (items: org_structure[], parentId: number | null = null): TreeNode[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        id: item.id,
        name: item.name,
        short_name: item.short_name,
        children: this.buildTree(items, item.id)
      }));
  }

  async loadorg_structures() {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        let res = this.buildTree(response.data)
        this.treeData = res;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteorg_structure(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteorg_structure(id);
          if (response.status === 201 || response.status === 200) {
            this.loadorg_structures();
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
      this.treeData = []
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
    });
  };
}

export default new NewStore();
