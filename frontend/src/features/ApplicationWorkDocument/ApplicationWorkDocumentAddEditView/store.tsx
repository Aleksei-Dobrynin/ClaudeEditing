import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getApplicationWorkDocument } from "api/ApplicationWorkDocument/useGetApplicationWorkDocument";
import {
  createApplicationWorkDocument,
  createApplicationWorkDocumentFromTemplate
} from "api/ApplicationWorkDocument/useCreateApplicationWorkDocument";
import { getWorkDocumentTypes } from "../../../api/WorkDocumentType/useGetWorkDocumentTypes";
import { getMyOrgStructures } from "../../../api/org_structure";
import { getTemplatesForStructure } from "../../../api/StructureTemplates";
import { getLanguages } from "../../../api/Language";
import { getS_DocumentTemplateTranslationsByidDocumentTemplate } from "../../../api/S_DocumentTemplateTranslation";

class NewStore {
  id = 0;
  file_id = 0;
  task_id = 0;
  comment = "";
  structure_employee_id = 0;
  DocumentTypes = [];
  Templates = [];
  DocumentTemplates = [];
  Languages = [];
  id_type = 0;
  template_id = 0;
  language_id = 0;
  document_body = '';
  document_name = '';
  metadata: any = null;
  FileName = "";
  File = null;
  idDocumentinputKey = "";
  isShowDocumentType = false;

  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.task_id = 0;
      this.comment = "";
      this.structure_employee_id = 0;
      this.DocumentTypes = [];
      this.Templates = [];
      this.DocumentTemplates = [];
      this.Languages = [];
      this.id_type = 0;
      this.template_id = 0;
      this.language_id = 0;
      this.document_body = '';
      this.document_name = '';
      this.metadata = null;
      this.isShowDocumentType = false;
      this.FileName = "";
      this.File = null;
      this.idDocumentinputKey = Math.random().toString(36);
      this.errors = {};
    });
  }

  updateField(id: string, value: any) {
    this.metadata = this.metadata.map((field) =>
      field.id === id ? { ...field, value } : field
    );
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

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {
      id: this.id - 0,
      file_id: this.file_id - 0,
      task_id: this.task_id - 0,
      id_type: this.id_type - 0,
      comment: this.comment,
      structure_employee_id: this.structure_employee_id - 0,
      FileName: this.FileName,
      metadata: JSON.stringify(toJS(this.metadata)),
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
        response = await createApplicationWorkDocument(data, this.FileName, this.File);
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

  async onSaveTemplateClick(onSaved: (id: number) => void) {
    var data = {
      id: this.id - 0,
      file_id: this.file_id - 0,
      task_id: this.task_id - 0,
      id_type: this.id_type - 0,
      document_body: this.document_body,
      document_name: this.document_name,
      comment: this.comment,
      structure_employee_id: this.structure_employee_id - 0,
      metadata: JSON.stringify(toJS(this.metadata)),
      FileName: "filename"
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
        response = await createApplicationWorkDocumentFromTemplate(data);
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
    this.loadWorkDocumentType()
    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadApplicationWorkDocument(id);
  }

  loadWorkDocumentType = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkDocumentTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.DocumentTypes = response.data;
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

  loadApplicationWorkDocument = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.file_id = response.data.file_id;

          this.task_id = response.task_id;
          this.id_type = response.id_type;
          this.comment = response.comment;
          this.structure_employee_id = response.structure_employee_id;
          this.FileName = response.FileName;
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

  async loadStructureTemplatess(){
    try {
      MainStore.changeLoader(true);
      const userStructures = await getMyOrgStructures();
      if (userStructures.status != 200) {
        throw new Error();
      }
      const first_structure_id = userStructures.data[0]?.id;
      const response = await getTemplatesForStructure(first_structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Templates = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Languages = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadS_DocumentTemplateTranslations(){
    try {
      MainStore.changeLoader(true);
      var documentId = this.Templates.find(t => t.id == this.template_id)?.template_id;
      if (!documentId){ return; }
      const response = await getS_DocumentTemplateTranslationsByidDocumentTemplate(documentId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.DocumentTemplates = response.data;
        this.language_id = this.language_id == 0 ? this.Languages?.[0]?.id : this.language_id;
        this.document_body = this.DocumentTemplates.find(d => d.idLanguage == this.language_id)?.template;
        this.document_name = this.Templates.find(t => t.id == this.template_id)?.name;
        console.log(this.document_name);
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
