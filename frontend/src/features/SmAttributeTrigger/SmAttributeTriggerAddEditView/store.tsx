import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSmAttributeTrigger } from "api/SmAttributeTrigger/useGetSmAttributeTrigger";
import { createSmAttributeTrigger } from "api/SmAttributeTrigger/useCreateSmAttributeTrigger";
import { updateSmAttributeTrigger } from "api/SmAttributeTrigger/useUpdateSmAttributeTrigger";
import dayjs from "dayjs";
import { getEntityAttributes } from "api/EntityAttributes";

class NewStore {
  id = 0;
  name = "";
  project_id = 0;
  attribute_id = 0;
  value = "";

  errorproject_id = "";
  errorattribute_id = "";
  errorvalue = "";

  // Справочники
  EntityAttributes = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.project_id = 0;
      this.attribute_id = 0;
      this.value = "";
      this.errorproject_id = "";
      this.errorattribute_id = "";
      this.errorvalue = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  validateBeforeSave = () => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "project_id", value: this.project_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "attribute_id", value: this.attribute_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "value", value: this.value } };
    canSave = validate(event) && canSave;
    return canSave;
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    const canSave = this.validateBeforeSave();
    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          project_id: this.project_id - 0,
          attribute_id: this.attribute_id - 0,
          value: this.value
        };
        let response;
        if (this.id === 0) {
          response = await createSmAttributeTrigger(data);
        } else {
          response = await updateSmAttributeTrigger(data);
        }
        if (response.status === 201 || response.status === 200) {
          onSaved(response);
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

  async doLoad(id: number) {

    await this.loadEntityAttributes();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadSmAttributeTrigger(id);
  }

  loadSmAttributeTrigger = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmAttributeTrigger(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.project_id = response.data.project_id;
          this.attribute_id = response.data.attribute_id;
          this.value = response.data.value;
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


  loadEntityAttributes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEntityAttributes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.EntityAttributes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

}

export default new NewStore();
