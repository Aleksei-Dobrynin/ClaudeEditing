import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getlegal_object } from "api/legal_object";
import { createlegal_object } from "api/legal_object";
import { updatelegal_object } from "api/legal_object";

 // dictionaries


class NewStore {
  id = 0
	description = ""
	address = ""
	geojson = ""
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.description = ""
		this.address = ""
		this.geojson = ""
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
      description: this.description,
      address: this.address,
      geojson: this.geojson,
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
        response = await createlegal_object(data);
      } else {
        response = await updatelegal_object(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response?.data?.id);
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

    this.loadlegal_object(id);
  }

  loadlegal_object = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_object(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.description = response.data.description;
          this.address = response.data.address;
          this.geojson = response.data.geojson;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
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
