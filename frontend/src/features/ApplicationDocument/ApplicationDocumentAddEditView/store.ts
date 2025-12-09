import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationDocumentTypes } from "api/ApplicationDocumentType/useGetApplicationDocumentTypes";
import { getApplicationDocument } from "api/ApplicationDocument/useGetApplicationDocument";
import { createApplicationDocument } from "api/ApplicationDocument/useCreateApplicationDocument";
import { updateApplicationDocument } from "api/ApplicationDocument/useUpdateApplicationDocument";
import { getSmProjectTypes } from "../../../api/SmProjectType";

class NewStore {
  id = 0;
  name = "";
  document_type_id = 0;
  description = "";
  law_description = "";
  doc_is_outcome = false;
  errorname = "";
  errordocument_type_id = "";
  errordescription = "";
  errorlaw_description = "";

  DocumentTypes = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.document_type_id = 0;
      this.law_description = "";
      this.description = "";
      this.doc_is_outcome = false;
      this.errorname = "";
      this.errordescription = "";
      this.errordocument_type_id = "";
      this.errorlaw_description = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "document_type_id", value: this.document_type_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;
    event = { target: { name: "law_description", value: this.law_description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          document_type_id: +this.document_type_id,
          description: this.description,
          law_description: this.law_description,
          doc_is_outcome: this.doc_is_outcome
        };

        const response = data.id === 0
          ? await createApplicationDocument(data)
          : await updateApplicationDocument(data);
          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
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
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  loadApplicationDocumentTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocumentTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.DocumentTypes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplicationDocumentType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.document_type_id = response.data.document_type_id;
          this.description = response.data.description;
          this.law_description = response.data.law_description;
          this.doc_is_outcome = response.data.doc_is_outcome;
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

  async doLoad(id: number) {
    this.loadApplicationDocumentTypes();
    if (id == null || id == 0) {
      return;
    }

    this.id = id;
    this.loadApplicationDocumentType(id);
  }
}

export default new NewStore();
