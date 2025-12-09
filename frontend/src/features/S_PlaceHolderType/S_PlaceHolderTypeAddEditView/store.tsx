import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getS_PlaceHolderType } from "api/S_PlaceHolderType";
import { createS_PlaceHolderType } from "api/S_PlaceHolderType";
import { updateS_PlaceHolderType } from "api/S_PlaceHolderType";

 // dictionaries


class NewStore {
  id = 0
	name = ""
	description = ""
	code = ""
	queueNumber = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.name = ""
		this.description = ""
		this.code = ""
		this.queueNumber = 0
		
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
        
      name: this.name,
        
      description: this.description,
        
      code: this.code,
        
      queueNumber: this.queueNumber - 0,
        
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
        response = await createS_PlaceHolderType(data);
      } else {
        response = await updateS_PlaceHolderType(data);
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

    this.loadS_PlaceHolderType(id);
  }

  loadS_PlaceHolderType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_PlaceHolderType(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.queueNumber = response.data.queueNumber;
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
