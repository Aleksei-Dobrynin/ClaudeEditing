import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_report_field_config } from "api/structure_report_field_config";
import { createstructure_report_field_config } from "api/structure_report_field_config";
import { updatestructure_report_field_config } from "api/structure_report_field_config";
import { getstructure_report_field_configByIdReportConfig } from "api/structure_report_field_config";
import { getunit_types } from "api/unit_type";

// dictionaries


class NewStore {
  id = 0
  structure_report_id = 0
  field_name = ""
  report_item = ""
  UnitTypes = []
  id_UnitTypes: number[]
  // created_at = null
  // updated_at = null
  // created_by = 0
  // updated_by = 0


  errors: { [key: string]: string } = {};

  // Справочники



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.structure_report_id = 0
      this.field_name = ""
      this.report_item = ""
      this.id_UnitTypes = []
      // this.created_at = null
      // this.updated_at = null
      // this.created_by = 0
      // this.updated_by = 0

      this.errors = {}
    });
  }

  changeUnitTipes(ids: number[]) {
    this.id_UnitTypes = ids;
  }

  loadUnitTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getunit_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.UnitTypes = response.data
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
      structureReportId: this.structure_report_id - 0,
      fieldName: this.field_name,
      reportItem: this.report_item,
      unitTypes: this.id_UnitTypes,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
      // created_by: this.created_by - 0,
      // updated_by: this.updated_by - 0,
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
        response = await createstructure_report_field_config(data);
      } else {
        response = await updatestructure_report_field_config(data);
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
      this.clearStore()
    }
  };

  async doLoad(id: number) {
    this.loadUnitTypes()
    //загрузка справочников


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_report_field_config(id);
  }

  loadstructure_report_field_config = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report_field_config(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.structure_report_id = response.data.structureReportId;
          this.field_name = response.data.fieldName;
          this.report_item = response.data.reportItem;
          this.id_UnitTypes= response.data.unitTypes;
          // this.created_at = dayjs(response.data.created_at);
          // this.updated_at = dayjs(response.data.updated_at);
          // this.created_by = response.data.created_by;
          // this.updated_by = response.data.updated_by;
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
