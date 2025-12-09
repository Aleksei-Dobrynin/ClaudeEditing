import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getlegal_record_object } from "api/legal_record_object";
import { createlegal_record_object } from "api/legal_record_object";
import { updatelegal_record_object } from "api/legal_record_object";

 // dictionaries

import { getlegal_objects } from "api/legal_object";
    
// import { getlegal_objects } from "api/legal_object";
    
import { getlegal_record_registries } from "api/legal_record_registry";
    
// import { getlegal_objects } from "api/legal_object";
    
// import { getlegal_objects } from "api/legal_object";
    

class NewStore {
  id = 0
	created_at = null
	updated_at = null
	created_by = 0
	updated_by = 0
	id_record = 0
	id_object = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  legal_objects = []
	// legal_objects = []
	legal_record_registries = []
	// legal_objects = []
	// legal_objects = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.created_at = null
		this.updated_at = null
		this.created_by = 0
		this.updated_by = 0
		this.id_record = 0
		this.id_object = 0
		
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
      id_record: this.id_record - 0,
      id_object: this.id_object - 0,
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
        response = await createlegal_record_object(data);
      } else {
        response = await updatelegal_record_object(data);
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
    await this.loadlegal_objects();
		await this.loadlegal_objects();
		await this.loadlegal_record_registries();
		await this.loadlegal_objects();
		await this.loadlegal_objects();
		

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadlegal_record_object(id);
  }

  loadlegal_record_object = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_record_object(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.id_record = response.data.id_record;
          this.id_object = response.data.id_object;
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

  
  loadlegal_objects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getlegal_objects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.legal_objects = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  // loadlegal_objects = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getlegal_objects();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.legal_objects = response.data
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };
    
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
    
  // loadlegal_objects = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getlegal_objects();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.legal_objects = response.data
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };
    
  // loadlegal_objects = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getlegal_objects();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.legal_objects = response.data
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };
    

}

export default new NewStore();
