import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getincomes } from "api/income";
import { getorg_structures } from "../../api/org_structure";
import dayjs, { Dayjs } from "dayjs";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  dateStart = dayjs();
  dateEnd = dayjs();
  number = null;
  structures = [];
  structures_ids = [];


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

  change(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
  }

  async load_structures() {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changeStructures(ids: number[]) {
    this.structures_ids = ids;
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  async loadincomes(){
    try {
      MainStore.changeLoader(true);
      const response = await getincomes(this.dateStart, this.dateEnd, this.number, this.structures_ids);
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

  clearStore(){
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.structures = [];
      this.structures_ids = [];
    });
  };
}

export default new NewStore();
