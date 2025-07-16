import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTechCouncil, createTechCouncil, updateTechCouncil, sendToTechCouncil } from "api/TechCouncil";
import { getMyOrgStructures, getorg_structures } from "../../../api/org_structure";
import {
  getActiveTechCouncilParticipantsSettingsByServiceId,
  getTechCouncilParticipantsSettingsByServiceId
} from "../../../api/TechCouncilParticipantsSettings";

class NewStore {
  id = 0;
  structure_id = 0;
  application_id = 0;
  service_id = 0;
  decision = "";
  org_structures = [];
  participants = [];
  errorstructure_id = "";
  errorapplication_id = "";
  errordecision = "";
  selectedParticipants = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.structure_id = 0;
      this.application_id = 0;
      this.decision = "";
      this.org_structures = [];
      this.participants = [];
      this.errorstructure_id = "";
      this.errorapplication_id = "";
      this.errordecision = "";
      this.selectedParticipants = [];
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
    event = { target: { name: "name", value: this.structure_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "code", value: this.application_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "decision", value: this.decision } };
    canSave = validate(event) && canSave;


    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          structure_id: this.structure_id,
          application_id: this.application_id,
          decision: this.decision,
        };

        const response = data.id === 0
          ? await createTechCouncil(data)
          : await updateTechCouncil(data);

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

  onCloseTechCouncil = async () => {
    try {
      MainStore.changeLoader(true);
      let data = {
        participants: this.selectedParticipants,
        application_id: this.application_id,
      }
      const response = await sendToTechCouncil(data);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadTechCouncil = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncil(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.structure_id = response.data.structure_id;
          this.application_id = response.data.application_id;
          this.decision = response.data.decision;
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

  loadUserOrgStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyOrgStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structure_id = response.data[0]?.id;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTechCouncilParticipantsSettings = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getActiveTechCouncilParticipantsSettingsByServiceId(this.service_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.participants = response.data
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
    this.loadTechCouncil(id);
  }
}

export default new NewStore();
