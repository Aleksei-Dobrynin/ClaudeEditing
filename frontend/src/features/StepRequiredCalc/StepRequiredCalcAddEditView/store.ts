import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getStepRequiredCalc, createStepRequiredCalc, updateStepRequiredCalc } from "api/StepRequiredCalc";
import { getorg_structures } from "../../../api/org_structure";
import { getpath_steps } from "../../../api/path_step";

class NewStore {
  id = 0;
  step_id = 0;
  structure_id = 0;
  errorstep_id = "";
  errorstructure_id = "";
  PathSteps = [];
  OrgStructures = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.step_id = 0;
      this.structure_id = 0;
      this.errorstep_id = "";
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
          step_id: this.step_id,
          structure_id: this.structure_id,
        };

        const response = data.id === 0
          ? await createStepRequiredCalc(data)
          : await updateStepRequiredCalc(data);

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

  loadStepRequiredCalc = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getStepRequiredCalc(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.step_id = response.data.step_id;
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

  loadOrgStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.OrgStructures = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadPathSteps = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getpath_steps();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.PathSteps = response.data
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
    await this.loadPathSteps();
    await this.loadOrgStructures();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadStepRequiredCalc(id);
  }
}

export default new NewStore();
