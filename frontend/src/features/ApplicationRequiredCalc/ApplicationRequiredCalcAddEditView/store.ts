import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationRequiredCalc, createApplicationRequiredCalc, updateApplicationRequiredCalc } from "api/ApplicationRequiredCalc";

class NewStore {
  id = 0;
  application_id = 0;
  application_step_id = 0;
  structure_id = 0;
  errorapplication_id = "";
  errorapplication_step_id = "";
  errorstructure_id = "";
  Applications = [];
  ApplicationSteps = [];
  OrgStructures = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.application_id = 0;
      this.application_step_id = 0;
      this.structure_id = 0;
      this.errorapplication_id = "";
      this.errorapplication_step_id = "";
      this.errorstructure_id = "";
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

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          application_id: this.application_id,
          application_step_id: this.application_step_id,
          structure_id: this.structure_id,
        };

        const response = data.id === 0
          ? await createApplicationRequiredCalc(data)
          : await updateApplicationRequiredCalc(data);

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

  loadApplicationRequiredCalc = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationRequiredCalc(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.application_id = response.data.application_id;
          this.application_step_id = response.data.application_step_id;
          this.structure_id = response.data.structure_id;
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
    this.loadApplicationRequiredCalc(id);
  }
}

export default new NewStore();
