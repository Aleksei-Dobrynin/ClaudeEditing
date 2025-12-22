import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getservice_path } from "api/service_path";
import { createservice_path } from "api/service_path";
import { updateservice_path } from "api/service_path";

 // dictionaries

import { getServices } from "api/Service/useGetServices";

export type EntityType = "path_step" | "step_required_document" | "step_partner" | "step_dependency";
export type ChangeKind = "add" | "update" | "delete";

export interface BufferedChange {
  entity: EntityType;
  kind: ChangeKind;
  id?: number | string;
  payload?: any;
}

class NewStore {
  id = 0
	service_id = 0
	name = ""
	description = ""
	is_default = false
	is_active = false

  errors: { [key: string]: string } = {};

  // Справочники
  services = []
  bufferList: BufferedChange[] = []
  private tempIdCounter = -1;


  constructor() {
    makeAutoObservable(this);
  }

  addBuffer(change: {
    entity: EntityType;
    kind: ChangeKind;
    id?: number | null;
    payload?: any;
  }){
    if (!this.bufferList) {
      this.bufferList = [];
    }
    console.log(0);
    if (change.kind === "add") {
      if (change.id == null) {
        const newId = this.tempIdCounter--;
        this.bufferList.push({
          entity: change.entity,
          kind: "add",
          id: newId,
          payload: change.payload
        });
        return;
      }

      const idx = this.bufferList.findIndex(
        x =>
          x.entity === change.entity &&
          x.kind === "add" &&
          x.id === change.id
      );

      if (idx !== -1) {
        this.bufferList[idx].payload = change.payload;
      } else {
        this.bufferList.push({
          entity: change.entity,
          kind: "add",
          id: change.id,
          payload: change.payload
        });
      }
      return;
    }
    if (change.kind === "update" && change.id != null) {
      const idx = this.bufferList.findIndex(
        x =>
          x.entity === change.entity &&
          x.kind === "update" &&
          x.id === change.id
      );
      if (idx !== -1) {
        this.bufferList[idx].payload = change.payload;
        return;
      }
      this.bufferList.push(change);
      return;
    }
    if (change.kind === "delete" && change.id != null) {
      const existsIdx = this.bufferList.findIndex(
        x => x.entity === change.entity && x.id === change.id
      );
      if (existsIdx !== -1 && this.bufferList[existsIdx].kind === "add") {
        this.bufferList.splice(existsIdx, 1);
        return;
      }
      this.bufferList.push(change);
    }
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.service_id = 0
		this.name = ""
		this.description = ""
		this.is_default = false
		this.is_active = false
		
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
      service_id: this.service_id - 0,
      name: this.name,
      description: this.description,
      is_default: this.is_default,
      is_active: this.is_active,
      children: this.bufferList,
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
        response = await createservice_path(data);
      } else {
        response = await updateservice_path(data);
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
    await this.loadservices();
		

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadservice_path(id);
  }

  loadservice_path = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getservice_path(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.service_id = response.data.service_id;
          this.name = response.data.name;
          this.description = response.data.description;
          this.is_default = response.data.is_default;
          this.is_active = response.data.is_active;
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

  
  loadservices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.services = response.data
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
