import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_report } from "api/structure_report";
import { createstructure_report } from "api/structure_report";
import { updatestructure_report } from "api/structure_report";
import { getstructure_report_configs } from "api/structure_report_config"
import { getorg_structures } from "api/org_structure";

// dictionaries


class NewStore {
  id = 0
  quarter = 0
  structure_id = 0
  status_id = 0
  report_config_id = 0
  month = 0
  year = 0
  Report_configs = []
  org_structures = []



  errors: { [key: string]: string } = {};

  // Справочники

  loadReport_Configs = async () => {
    try {
      const response = await getstructure_report_configs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Report_configs = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    };
  }

  async loadorg_structures() {
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

  Setreport_config_id(id: number) {
    this.report_config_id = id
  }


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.quarter = 0
      this.structure_id = 0
      this.status_id = 0
      this.report_config_id = 0
      this.month = 0
      this.year = 0

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      quarter: this.quarter - 0,
      structureId: this.structure_id - 0,
      statusId: this.status_id - 0,
      reportConfigId: this.report_config_id - 0,
      month: this.month - 0,
      year: this.year - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createstructure_report(data);
      } else {
        response = await updatestructure_report(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        if (data.id === 0) {
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        } else {
          MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
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

  async doLoad(id: number) {

    this.loadReport_Configs()
    this.loadorg_structures()
    //загрузка справочников


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_report(id);
  }

  loadstructure_report = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.quarter = response.data.quarter;
          this.structure_id = response.data.structureId;
          this.status_id = response.data.statusId;
          this.report_config_id = response.data.reportConfigId;
          // this.created_at = dayjs(response.data.created_at);
          // this.updated_at = dayjs(response.data.updated_at);
          // this.created_by = response.data.created_by;
          // this.updated_by = response.data.updated_by;
          this.month = response.data.month;
          this.year = response.data.year;
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };



}

export default new NewStore();
