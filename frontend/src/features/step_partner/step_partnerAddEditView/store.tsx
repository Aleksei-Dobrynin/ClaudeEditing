import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstep_partner } from "api/step_partner";
import { createstep_partner } from "api/step_partner";
import { updatestep_partner } from "api/step_partner";

 // dictionaries

import { getpath_steps } from "api/path_step";
    
import { getContragents } from "api/Contragent";
    

class NewStore {
  id = 0
	step_id = 0
	partner_id = 0
	role = ""
	is_required = false
	

  errors: { [key: string]: string } = {};

  // Справочники
  path_steps = []
	contragents = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.step_id = 0
		this.partner_id = 0
		this.role = ""
		this.is_required = false
		
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
      step_id: this.step_id - 0,
      partner_id: this.partner_id - 0,
      role: this.role,
      is_required: this.is_required,
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
        response = await createstep_partner(data);
      } else {
        response = await updatestep_partner(data);
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
    await this.loadpath_steps();
    await this.loadcontragents();
    
    // For a new record (id=0), set step_id to the current step
    if (id === 0) {
      // Get the idMain from the list store
      const listStore = require('./../step_partnerListView/store').default;
      this.step_id = listStore.idMain;
      return;
    }
    
    this.id = id;
    this.loadstep_partner(id);
  }

  loadstep_partner = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstep_partner(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.step_id = response.data.step_id;
          this.partner_id = response.data.partner_id;
          this.role = response.data.role;
          this.is_required = response.data.is_required;
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

  
  loadpath_steps = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getpath_steps();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.path_steps = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadcontragents = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getContragents();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.contragents = response.data
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