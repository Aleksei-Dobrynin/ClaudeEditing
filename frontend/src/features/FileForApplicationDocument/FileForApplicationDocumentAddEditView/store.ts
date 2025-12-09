import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getFileForApplicationDocument } from "api/FileForApplicationDocument/useGetFileForApplicationDocument";
import { createFileForApplicationDocument } from "api/FileForApplicationDocument/useCreateFileForApplicationDocument";
import { updateFileForApplicationDocument } from "api/FileForApplicationDocument/useUpdateFileForApplicationDocument";
import { getFileTypeForApplicationDocuments } from "../../../api/FileTypeForApplicationDocument/useGetFileTypeForApplicationDocuments";
import { getFiles } from "../../../api/File/useGetFiles";

class NewStore {
  id = 0;
  file_id = 0;
  document_id = 0;
  idDocument = 0;
  type_id = 0;
  name = "";
  errorfile_id = "";
  errordocument_id = "";
  errortype_id = "";
  errorname = "";

  FileName = "";
  File = null;
  idDocumentinputKey = "";
  errorFileName = "";

  Files = [];
  Types = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.document_id = 0;
      this.idDocument = 0;
      this.type_id = 0;
      this.name = "";
      this.errorfile_id = "";
      this.errordocument_id = "";
      this.errortype_id = "";
      this.errorname = "";
      this.File = null;
      this.FileName = "";
      this.errorFileName = "";
      this.idDocumentinputKey = Math.random().toString(36);
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;

    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;

    event = { target: { name: "FileName", value: this.FileName } };
    canSave = validate(event) && canSave;

    event = { target: { name: "type_id", value: this.type_id } };
    canSave = validate(event) && canSave;
    
    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          file_id: this.file_id,
          document_id: this.idDocument,
          type_id: this.type_id,
          name: this.name,
        };

        const response =
          data.id === 0
            ? await createFileForApplicationDocument(data, this.File, this.FileName)
            : await updateFileForApplicationDocument(data, this.File, this.FileName);

        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
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

  loadFileTypeForApplicationDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getFileTypeForApplicationDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Types = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadFileForApplicationDocument = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getFileForApplicationDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.file_id = response.data.file_id;
          this.document_id = response.data.document_id;
          this.type_id = response.data.type_id;
          this.FileName = response.data.file_name;
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
    this.loadFileTypeForApplicationDocuments();
    // this.loadFiles();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadFileForApplicationDocument(id);
  }
}

export default new NewStore();
