import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getTechCouncilSession,
  createTechCouncilSession,
  updateTechCouncilSession,
  toArchiveTechCouncilSession
} from "api/TechCouncilSession";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  date = null;
  is_active = false;
  name = "";
  description = "";
  code = "";
  errordate = "";
  errorname = "";
  errordescription = "";
  errorcode = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.date = null;
      this.name = "";
      this.description = "";
      this.code = "";
      this.errordate = "";
      this.errorname = "";
      this.errordescription = "";
      this.errorcode = "";
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

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          date: this.date
        };

        const response = data.id === 0
          ? await createTechCouncilSession(data)
          : await updateTechCouncilSession(data);

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

  toArchive = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await toArchiveTechCouncilSession(this.id);
      if (response.status === 201 || response.status === 200) {
        this.loadTechCouncilSession(this.id)
        MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTechCouncilSession = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilSession(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.date = dayjs(response.data.date);
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

  async doLoad(id: number) {
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadTechCouncilSession(id);
  }
}

export default new NewStore();
