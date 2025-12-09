import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_report_field } from "api/structure_report_field";
import { createstructure_report_field } from "api/structure_report_field";
import { updatestructure_report_field } from "api/structure_report_field";
import { getunit_types } from "api/unit_type"

 // dictionaries


class NewStore {
  id = 0
	report_id = 0
	field_id = 0
	unit_id = 0
	value = 0
	// created_at = null
	// updated_at = null
	// created_by = 0
	// updated_by = 0
  Unit_types = []
	

  errors: { [key: string]: string } = {};

  // Справочники
  
  loadUnit_types = async () => {
    try {
      const response = await getunit_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Unit_types = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  };
}

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.report_id = 0
		this.field_id = 0
		this.unit_id = 0
		this.value = 0
		// this.created_at = null
		// this.updated_at = null
		// this.created_by = 0
		// this.updated_by = 0
		
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
      reportId: this.report_id - 0,
      fieldId: this.field_id - 0,
      unitId: this.unit_id - 0,
      value: this.value - 0,
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
        response = await createstructure_report_field(data);
      } else {
        response = await updatestructure_report_field(data);
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

    //загрузка справочников
    this.loadUnit_types()

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_report_field(id);
  }

  loadstructure_report_field = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report_field(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.report_id = response.data.reportId;
          this.field_id = response.data.fieldId;
          this.unit_id = response.data.unitId;
          this.value = response.data.value;
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
