import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getTechCouncilParticipantsSettings, createTechCouncilParticipantsSettings, updateTechCouncilParticipantsSettings } from "api/TechCouncilParticipantsSettings";
import { getorg_structures } from "../../../api/org_structure";
import { getServices } from "../../../api/Service/useGetServices";

class NewStore {
  id = 0;
  structure_id = 0;
  service_id = 0;
  is_active = false;
  structures = [];
  services = [];
  errorstructure_id = "";
  errorservice_id = "";
  erroris_active = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.structure_id = 0;
      this.service_id = 0;
      this.is_active = false;
      this.errorstructure_id = "";
      this.errorservice_id = "";
      this.erroris_active = "";
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
    event = { target: { name: "description", value: this.service_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "code", value: this.is_active } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          structure_id: this.structure_id,
          service_id: this.service_id,
          is_active: this.is_active,
        };

        const response = data.id === 0
          ? await createTechCouncilParticipantsSettings(data)
          : await updateTechCouncilParticipantsSettings(data);

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

  loadTechCouncilParticipantsSettings = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilParticipantsSettings(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.structure_id = response.data.structure_id;
          this.service_id = response.data.service_id;
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

  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.services = response.data
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
    this.loadorg_structures();
    this.loadServices();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadTechCouncilParticipantsSettings(id);
  }
}

export default new NewStore();
