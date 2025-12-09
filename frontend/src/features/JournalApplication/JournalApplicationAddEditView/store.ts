import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getJournalApplication, createJournalApplication, updateJournalApplication } from "api/JournalApplication";

class NewStore {
  id = 0;
  journal_id = 0;
  application_id = 0;
  application_status_id = 0;
  outgoing_number = "";

  errorjournal_id = "";
  errorapplication_id = "";
  errorapplication_status_id = "";
  erroroutgoing_number = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.journal_id = 0;
      this.errorjournal_id = "";
      this.application_id = 0;
      this.errorapplication_id = "";
      this.application_status_id = 0;
      this.errorapplication_status_id = "";
      this.outgoing_number = "";
      this.erroroutgoing_number = "";
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
          journal_id: this.journal_id,
          application_id: this.application_id,
          application_status_id: this.application_status_id,
          outgoing_number: this.outgoing_number,
        };

        const response = data.id === 0
          ? await createJournalApplication(data)
          : await updateJournalApplication(data);

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

  loadJournalApplication = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getJournalApplication(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.journal_id = response.data.journal_id;
          this.application_id = response.data.application_id;
          this.application_status_id = response.data.application_status_id;
          this.outgoing_number = response.data.outgoing_number;
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
    this.loadJournalApplication(id);
  }
}

export default new NewStore();
