import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { createExcelUpload } from "api/ExcelUpload/useCreateExcelUpload";

class NewStore {
  id = 0;
  file_id = 0;
  document_id = 0;
  idDocument = 0;
  errorfile_id = "";
  errordocument_id = "";
  FileName = "";
  File = null;
  idDocumentinputKey = "";
  errorFileName = "";

  Banks = [
    { id: 1, key: "mbank", name: "Mbank" },
    { id: 2, key: "keremet", name: "Керемет банк" }
  ];
  bank_id = 0;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.document_id = 0;
      this.idDocument = 0;
      this.errorfile_id = "";
      this.errordocument_id = "";
      this.File = null;
      this.FileName = "";
      this.errorFileName = "";
      this.idDocumentinputKey = Math.random().toString(36);
      this.bank_id = 0;
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
      target: { name: "id", value: this.id }
    };
    canSave = validate(event) && canSave;

    event = { target: { name: "FileName", value: this.FileName } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        let bank = this.Banks.find(b => b.id == this.bank_id)
        var data = {
          id: this.id,
          file_id: this.file_id,
          document_id: this.idDocument,
          bank_id: bank.key
        };

        const response = await createExcelUpload(data, this.File, this.FileName);

        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          this.clearStore();
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
}

export default new NewStore();
