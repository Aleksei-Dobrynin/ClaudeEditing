import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getS_TemplateDocumentPlaceholder } from "api/S_TemplateDocumentPlaceholder";
import { createS_TemplateDocumentPlaceholder } from "api/S_TemplateDocumentPlaceholder";
import { updateS_TemplateDocumentPlaceholder } from "api/S_TemplateDocumentPlaceholder";

 // dictionaries

import { getS_DocumentTemplateTranslations } from "api/S_DocumentTemplateTranslation";
    
import { getS_PlaceHolderTemplates } from "api/S_PlaceHolderTemplate";
    

class NewStore {
  id = 0
	idTemplateDocument = 0
	idPlaceholder = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  S_DocumentTemplateTranslations = []
	S_PlaceHolderTemplates = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.idTemplateDocument = 0
		this.idPlaceholder = 0
		
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
        
      idTemplateDocument: this.idTemplateDocument - 0,
        
      idPlaceholder: this.idPlaceholder - 0,
        
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
        response = await createS_TemplateDocumentPlaceholder(data);
      } else {
        response = await updateS_TemplateDocumentPlaceholder(data);
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
    await this.loadS_DocumentTemplateTranslations();
		await this.loadS_PlaceHolderTemplates();
		

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadS_TemplateDocumentPlaceholder(id);
  }

  loadS_TemplateDocumentPlaceholder = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_TemplateDocumentPlaceholder(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.idTemplateDocument = response.data.idTemplateDocument;
          this.idPlaceholder = response.data.idPlaceholder;
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

  
  loadS_DocumentTemplateTranslations = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplateTranslations();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_DocumentTemplateTranslations = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadS_PlaceHolderTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_PlaceHolderTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.S_PlaceHolderTemplates = response.data
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
