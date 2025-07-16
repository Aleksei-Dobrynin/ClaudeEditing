import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getLawDocument, createLawDocument, updateLawDocument } from "api/LawDocument";
import { getLawDocumentTypes } from "../../../api/LawDocumentType";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  name = "";
  data = null;
  description = "";
  type_id = 0;
  link = "";
  name_kg = "";
  description_kg = ""
  errorname = "";
  errordata = "";
  errordescription = "";
  errortype_id = "";
  errorlink = "";
  errorname_kg = "";
  errordescription_kg = ""
  LawDocumentTypes = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.data = null;
      this.description = "";
      this.type_id = 0;
      this.link = "";
      this.name_kg = "";
      this.description_kg = ""
      this.errorname = "";
      this.errordata = "";
      this.errordescription = "";
      this.errortype_id = "";
      this.errorlink = "";
      this.errorname_kg = "";
      this.errordescription_kg = ""
    });
  }

  handleChange(event) {
    console.log(event);
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
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          data: this.data,
          description: this.description,
          type_id: this.type_id,
          link: this.link,
          name_kg: this.name_kg,
          description_kg: this.description_kg,
        };

        const response = data.id === 0
          ? await createLawDocument(data)
          : await updateLawDocument(data);

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

  loadLawDocument = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getLawDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.data = dayjs(response.data.data);
          this.description = response.data.description;
          this.type_id = response.data.type_id;
          this.link = response.data.link;
          this.name_kg = response.data.name_kg;
          this.description_kg = response.data.description_kg;
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

  loadLawDocumentTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLawDocumentTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.LawDocumentTypes = response.data;
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
    this.loadLawDocumentTypes();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadLawDocument(id);
  }
}

export default new NewStore();
