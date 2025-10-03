import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getcontragent_interaction_doc } from "api/contragent_interaction_doc";
import { createcontragent_interaction_doc } from "api/contragent_interaction_doc";
import { updatecontragent_interaction_doc } from "api/contragent_interaction_doc";

class ContragentInteractionDocStore {
  id = 0;
  file_id = 0;
  interaction_id = 0;
  message = "";
  fileName = "";
  File = null;
  idDocumentInputKey = "";
  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      // НЕ сбрасываем interaction_id здесь!
      // this.interaction_id = 0;
      this.message = "";
      this.fileName = "";
      this.File = null;
      this.idDocumentInputKey = Math.random().toString(36);
      this.errors = {};
    });
  }

  // Полная очистка включая interaction_id (для unmount компонента)
  fullClearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.interaction_id = 0;
      this.message = "";
      this.fileName = "";
      this.File = null;
      this.idDocumentInputKey = Math.random().toString(36);
      this.errors = {};
    });
  }

  setInteractionId(id: number) {
    this.interaction_id = id;
  }

  handleChange(event) {
    const { name, value } = event.target;
    runInAction(() => {
      (this as any)[name] = value;
    });
    this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    runInAction(() => {
      if (isValid) {
        this.errors[name] = "";
      } else {
        this.errors[name] = error;
      }
    });
  }

  changeDocInputKey() {
    this.idDocumentInputKey = Math.random().toString(36);
  }

  async onSaveClick(onSaved: (response?: any) => void) {
    const isPortal = localStorage.getItem("portal") != null;
    
    const data = {
      id: this.id,
      file_id: this.file_id,
      interaction_id: this.interaction_id,
      fileName: this.fileName,
      message: this.message,
      is_portal: isPortal,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      runInAction(() => {
        this.errors = errors;
      });
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      
      if (this.id === 0) {
        response = await createcontragent_interaction_doc(data, this.fileName, this.File);
      } else {
        response = await updatecontragent_interaction_doc(data, this.fileName, this.File);
      }

      if (response.status === 201 || response.status === 200) {
        if (this.id === 0) {
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        } else {
          MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
        }
        onSaved(response);
        // Очищаем форму после успешного сохранения, НО сохраняем interaction_id
        this.clearStore();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async doLoad(id: number, interactionId?: number) {
    // Если передан interactionId, устанавливаем его
    if (interactionId !== undefined && interactionId !== null) {
      this.setInteractionId(interactionId);
    }
    
    if (id === null || id === 0) {
      // Очищаем только поля формы, но НЕ interaction_id
      this.clearStore();
      return;
    }
    
    this.id = id;
    await this.loadcontragent_interaction_doc(id);
  }

  loadcontragent_interaction_doc = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontragent_interaction_doc(id);
      
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.file_id = response.data.file_id;
          this.interaction_id = response.data.interaction_id;
          this.message = response.data.message || "";
          this.fileName = response.data.file_name || "";
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

export default new ContragentInteractionDocStore();