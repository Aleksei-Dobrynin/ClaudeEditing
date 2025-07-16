import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getCustomSvgIcon } from "api/CustomSvgIcon";
import { createCustomSvgIcon } from "api/CustomSvgIcon";
import { updateCustomSvgIcon } from "api/CustomSvgIcon";

 // dictionaries


class NewStore {
  id = 0
	name = ""
	svgPath = ""
	usedTables = ""
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.name = ""
		this.svgPath = ""
		this.usedTables = ""
		
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
        
      svgPath: this.svgPath,
        
      usedTables: this.usedTables,
        
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
        response = await createCustomSvgIcon(data);
      } else {
        response = await updateCustomSvgIcon(data);
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

    this.loadCustomSvgIcon(id);
  }

  loadCustomSvgIcon = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomSvgIcon(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.name = response.data.name;
          this.svgPath = response.data.svgPath;
          this.usedTables = response.data.usedTables;
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
