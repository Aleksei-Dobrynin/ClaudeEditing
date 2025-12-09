import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { deleteapplication_in_reestr, deleteapplication_in_reestrsByAppId, getOtchetData } from "api/application_in_reestr";
import { getapplication_in_reestrsByreestr_id } from "api/application_in_reestr";
import { changeAllApplicationStatusInReestr, changeReestrStatus } from "api/reestr";
import { getorg_structures } from "api/org_structure";
import { ReestrCode } from "constants/constant";

class NewStore {
  data = [];
  org_structures = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  isEdit = false;
  fizic_lica = []
  youri_lica = []
  fizic_summa = 0
  youri_summa = 0
  all_summa = 0
  reestr = null;
  rowClickedId = 0;


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

  clickRow(id: number) {
    this.rowClickedId = id
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  doLoad () {
    this.loadorg_structures();
  }

  async loadorg_structures(){
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadapplication_in_reestrs(){
    try {
      MainStore.changeLoader(true);
      const response = await getOtchetData(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fizic_lica = response.data?.fiz_lica;
        this.youri_lica = response.data?.your_lica;
        this.fizic_summa = response.data?.fiz_summa;
        this.youri_summa = response.data?.your_summa;
        this.all_summa = response.data?.all_summa;
        this.reestr = response.data?.reestr;
        this.org_structures = response.data?.structures;
        // this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteapplication_in_reestr(app_id: number){
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteapplication_in_reestrsByAppId(app_id);
          if (response.status === 201 || response.status === 200) {
            this.loadapplication_in_reestrs();
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

  changeAllStatuses(){
    if (this.reestr == null) return;

    MainStore.openErrorConfirm(
      i18n.t("Реализовать все договора этом реестре?"),
      i18n.t("yes"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await changeAllApplicationStatusInReestr(this.reestr.id);
          if (response.status === 201 || response.status === 200) {
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
            this.loadapplication_in_reestrs();
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

  changeStatusReestr(){
    if (this.reestr == null) return;
    let code = ReestrCode.EDITED;
    if (this.reestr.status_code == code){
      code = ReestrCode.ACCEPTED;
    }
    MainStore.openErrorConfirm(
      i18n.t("Изменить статус реестра"),
      i18n.t("yes"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await changeReestrStatus(code, this.reestr.id);
          if (response.status === 201 || response.status === 200) {
            if (this.reestr)
              this.reestr.status_code = code;
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
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.rowClickedId = 0;
    });
  };
}

export default new NewStore();
