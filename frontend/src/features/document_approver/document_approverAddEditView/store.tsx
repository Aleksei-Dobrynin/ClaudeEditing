import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getdocument_approver } from "api/document_approver";
import { createdocument_approver } from "api/document_approver";
import { updatedocument_approver } from "api/document_approver";

 // dictionaries

import { getstep_required_documents } from "api/step_required_document";
    
import { getorg_structures } from "api/org_structure";
    
import { getStructurePosts } from "api/StructurePost/useGetStructurePosts";
    

class NewStore {
  id = 0
	step_doc_id = 0
	department_id = 0
	position_id = 0
	is_required = false
	approval_order = 0
	

  errors: { [key: string]: string } = {};

  // Справочники
  step_required_documents = []
	org_structures = []
	structure_posts = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.step_doc_id = 0
		this.department_id = 0
		this.position_id = 0
		this.is_required = false
		this.approval_order = 0
		
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
      step_doc_id: this.step_doc_id - 0,
      department_id: this.department_id - 0,
      position_id: this.position_id - 0,
      is_required: this.is_required,
      approval_order: this.approval_order - 0,
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
        response = await createdocument_approver(data);
      } else {
        response = await updatedocument_approver(data);
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
    await this.loadstep_required_documents();
		await this.loadorg_structures();
		await this.loadstructure_posts();
		

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loaddocument_approver(id);
  }

  loaddocument_approver = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getdocument_approver(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.step_doc_id = response.data.step_doc_id;
          this.department_id = response.data.department_id;
          this.position_id = response.data.position_id;
          this.is_required = response.data.is_required;
          this.approval_order = response.data.approval_order;
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

  
  loadstep_required_documents = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getstep_required_documents();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.step_required_documents = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadstructure_posts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructurePosts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structure_posts = response.data
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
