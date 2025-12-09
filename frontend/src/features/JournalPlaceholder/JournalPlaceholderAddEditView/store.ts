import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getJournalPlaceholder, createJournalPlaceholder, updateJournalPlaceholder } from "api/JournalPlaceholder";

class NewStore {
  id = 0;
  order_number = 0;
  template_id = 0;
  journal_id = 0;
  errororder_number = "";
  errortemplate_id = "";
  errorjournal_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.order_number = 0;
      this.errororder_number = "";
      this.template_id = 0;
      this.errortemplate_id = "";
      this.journal_id = 0;
      this.errorjournal_id = "";
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

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          order_number: this.order_number,
          template_id: this.template_id,
          journal_id: this.journal_id,
        };

        const response = data.id === 0
          ? await createJournalPlaceholder(data)
          : await updateJournalPlaceholder(data);

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

  loadJournalPlaceholder = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getJournalPlaceholder(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.order_number = response.data.order_number;
          this.template_id = response.data.template_id;
          this.journal_id = response.data.journal_id;
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
    this.loadJournalPlaceholder(id);
  }
}

export default new NewStore();
