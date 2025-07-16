import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getlegal_act_registry_status } from "api/legal_act_registry_status";
import { createlegal_act_registry_status } from "api/legal_act_registry_status";
import { updatelegal_act_registry_status } from "api/legal_act_registry_status";

 // dictionaries


class NewStore {
  id = 0
	description_kg = ""
	text_color = ""
	background_color = ""
	name = ""
	description = ""
	code = ""
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
	name_kg = ""
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.description_kg = ""
		this.text_color = ""
		this.background_color = ""
		this.name = ""
		this.description = ""
		this.code = ""
		this.created_at = null
		this.updated_at = null
		this.created_by = 0
		this.updated_by = 0
		this.name_kg = ""
		
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
      description_kg: this.description_kg,
      text_color: this.text_color,
      background_color: this.background_color,
      name: this.name,
      description: this.description,
      code: this.code,
      created_at: this.created_at,
      updated_at: this.updated_at,
      created_by: this.created_by - 0,
      updated_by: this.updated_by - 0,
      name_kg: this.name_kg,
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
        response = await createlegal_act_registry_status(data);
      } else {
        response = await updatelegal_act_registry_status(data);
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

    this.loadlegal_act_registry_status(id);
  }

  loadlegal_act_registry_status = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registry_status(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.description_kg = response.data.description_kg;
          this.text_color = response.data.text_color;
          this.background_color = response.data.background_color;
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.name_kg = response.data.name_kg;
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
