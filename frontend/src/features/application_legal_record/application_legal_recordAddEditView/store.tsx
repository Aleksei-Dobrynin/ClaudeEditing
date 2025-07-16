import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_legal_record } from "api/application_legal_record";
import { createapplication_legal_record } from "api/application_legal_record";
import { updateapplication_legal_record } from "api/application_legal_record";

 // dictionaries

import { getApplications } from "api/Application/useGetApplications";
    
import { getlegal_record_registries } from "api/legal_record_registry";
    
import { getlegal_act_registries } from "api/legal_act_registry";
    

class NewStore {
  id = 0
	id_application = 0
	id_legalrecord = 0
	id_legalact = 0
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  applications = []
	legal_record_registries = []
	legal_act_registries = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.id_application = 0
		this.id_legalrecord = 0
		this.id_legalact = 0
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
      id_application: this.id_application - 0,
      id_legalrecord: this.id_legalrecord - 0,
      id_legalact: this.id_legalact - 0,
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
        response = await createapplication_legal_record(data);
      } else {
        response = await updateapplication_legal_record(data);
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
    await this.loadapplications();
		await this.loadlegal_record_registries();
		await this.loadlegal_act_registries();
		

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_legal_record(id);
  }

  loadapplication_legal_record = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_legal_record(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.id_application = response.data.id_application;
          this.id_legalrecord = response.data.id_legalrecord;
          this.id_legalact = response.data.id_legalact;
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

  
  loadapplications = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplications();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applications = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadlegal_record_registries = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_record_registries();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.legal_record_registries = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadlegal_act_registries = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_act_registries();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.legal_act_registries = response.data
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
