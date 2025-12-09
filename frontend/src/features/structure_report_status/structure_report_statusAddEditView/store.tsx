import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstructure_report_status } from "api/structure_report_status";
import { createstructure_report_status } from "api/structure_report_status";
import { updatestructure_report_status } from "api/structure_report_status";

 // dictionaries


class NewStore {
  id = 0
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
	name = ""
	code = ""
	description = ""
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		// this.created_at = null
		// this.updated_at = null
		// this.created_by = 0
		// this.updated_by = 0
		this.name = ""
		this.code = ""
		this.description = ""
		
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
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      name: this.name,
      code: this.code,
      description: this.description,
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
        response = await createstructure_report_status(data);
      } else {
        response = await updatestructure_report_status(data);
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
    

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstructure_report_status(id);
  }

  loadstructure_report_status = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_report_status(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          // this.created_at = dayjs(response.data.created_at);
          // this.updated_at = dayjs(response.data.updated_at);
          // this.created_by = response.data.created_by;
          // this.updated_by = response.data.updated_by;
          this.name = response.data.name;
          this.code = response.data.code;
          this.description = response.data.description;
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
