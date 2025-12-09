import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getunit_for_field_config } from "api/unit_for_field_config";
import { createunit_for_field_config } from "api/unit_for_field_config";
import { updateunit_for_field_config } from "api/unit_for_field_config";
import { getunit_types } from "api/unit_type"

 // dictionaries


class NewStore {
  id = 0
	unit_id = 0
	field_id = 0
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
  Unit_types = []
  // Fields = []

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
		this.unit_id = 0
		this.field_id = 0
		this.created_at = null
		this.updated_at = null
		this.created_by = 0
		this.updated_by = 0
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
      unitId: this.unit_id - 0,
      fieldId: this.field_id - 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
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
        response = await createunit_for_field_config(data);
      } else {
        response = await updateunit_for_field_config(data);
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

    this.loadunit_for_field_config(id);
  }

  loadunit_for_field_config = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getunit_for_field_config(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.unit_id = response.data.unitId;
          this.field_id = response.data.fieldId;
          // this.created_at = dayjs(response.data.createdAt);
          // this.updated_at = dayjs(response.data.updatedAt);
          // this.created_by = response.data.createdBy;
          // this.updated_by = response.data.updatedBy;
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
