import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstep_required_document } from "api/step_required_document";
import { createstep_required_document } from "api/step_required_document";
import { updatestep_required_document } from "api/step_required_document";
import buffer from "../../service_path/service_pathAddEditView/store";

 // dictionaries

import { getpath_steps } from "api/path_step";
    
import { getApplicationDocuments } from "api/ApplicationDocument/useGetApplicationDocuments";
    

class NewStore {
  id = 0
	step_id = 0
	document_type_id = 0
	is_required = false
	

  errors: { [key: string]: string } = {};

  // Справочники
  path_steps = []
	application_documents = []
	


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.step_id = 0
		this.document_type_id = 0
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
      document_type_id: this.document_type_id - 0,
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
      if (this.id <= 0) {
        //response = await createstep_required_document(data);
        buffer.addBuffer({
          entity: "step_required_document",
          kind: "add",
          id: this.id < 0 ? this.id : undefined,
          payload: data
        });
      } else {
        // response = await updatestep_required_document(data);
        buffer.addBuffer({
          entity: "step_required_document",
          kind: "update",
          id: data.id,
          payload: data
        });
      }
      onSaved(1);
      // if (response.status === 201 || response.status === 200) {
      //   onSaved(response);
      //   if (data.id === 0) {
      //     MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      //   } else {
      //     MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
      //   }
      // } else {
      //   throw new Error();
      // }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadpath_steps();
		await this.loadapplication_documents();
		

    if (id === null || id === 0) {
      return;
    }

    if (id < 0) {
      const change = buffer.bufferList?.find(
        x => x.entity === "step_required_document" && x.kind === "add" && x.id === id
      );

      if (change?.payload) {
        const p = change.payload;
        this.id = id;
        this.step_id = p.step_id;
        this.document_type_id = p.document_type_id;
        this.is_required = p.is_required;
      }
      return;
    }
    this.id = id;

    this.loadstep_required_document(id);
  }

  loadstep_required_document = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const buffered = (buffer.bufferList ?? []).find(
        x =>
          x.entity === "step_required_document" &&
          x.kind === "update" &&
          x.id === id
      );

      if (buffered?.payload) {
        this.fillFromData(buffered.payload);
        return;
      }
      const response = await getstep_required_document(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fillFromData(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  private fillFromData(data: any) {
    runInAction(() => {
      this.id = data.id;
      this.step_id = data.step_id;
      this.document_type_id = data.document_type_id;
      this.is_required = data.is_required;
    });
  }
  
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
    
  loadapplication_documents = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_documents = response.data
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
