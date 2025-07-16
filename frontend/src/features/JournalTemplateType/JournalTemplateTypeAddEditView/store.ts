import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getJournalTemplateType, createJournalTemplateType, updateJournalTemplateType } from "api/JournalTemplateType";
import { getS_PlaceHolderTemplates } from "../../../api/S_PlaceHolderTemplate";

class NewStore {
  id = 0;
  code = "";
  name = "";
  raw_value = "";
  placeholder_id = 0;
  example = "";
  Placeholders = []

  errorcode = "";
  errorname = "";
  errorraw_value = "";
  errorplaceholder_id = "";
  errorexample = "";


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.code = "";
      this.errorcode = "";
      this.name = "";
      this.errorname = "";
      this.raw_value = "";
      this.errorraw_value = "";
      this.placeholder_id = 0;
      this.errorplaceholder_id = "";
      this.example = "";
      this.errorexample = "";
      this.Placeholders = [];
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id }
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          code: this.code,
          name: this.name,
          raw_value: this.raw_value,
          placeholder_id: this.placeholder_id,
          example: this.example,
        };

        const response = data.id === 0
          ? await createJournalTemplateType(data)
          : await updateJournalTemplateType(data);

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

  loadJournalTemplateType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getJournalTemplateType(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.code = response.data.code;
          this.name = response.data.name;
          this.raw_value = response.data.raw_value;
          this.placeholder_id = response.data.placeholder_id;
          this.example = response.data.example;
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

  loadS_PlaceHolderTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_PlaceHolderTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Placeholders = response.data
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
    this.loadS_PlaceHolderTemplates()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadJournalTemplateType(id);
  }
}

export default new NewStore();
