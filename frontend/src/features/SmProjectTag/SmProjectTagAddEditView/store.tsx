import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSmProjectTag } from "api/SmProjectTag";
import { createSmProjectTag } from "api/SmProjectTag";
import { updateSmProjectTag } from "api/SmProjectTag";
import dayjs from "dayjs";
import { getEntityAttributes } from "api/EntityAttributes";
import { getSurveyTags } from "api/SurveyTag/useGetSurveyTags";

class NewStore {
  id = 0;
  name = "";
  project_id = 0;
  tag_id = 0;

  errorproject_id = "";
  errortag_id = "";

  // Справочники
  SurveyTags = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.project_id = 0;
      this.tag_id = 0;
      this.errorproject_id = "";
      this.errortag_id = "";
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
    event = { target: { name: "tag_id", value: this.tag_id } };
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
          tag_id: this.tag_id - 0,
        };
        let response;
        if (this.id === 0) {
          response = await createSmProjectTag(data);
        } else {
          response = await updateSmProjectTag(data);
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

    await this.loadSurveyTags();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadSmProjectTag(id);
  }

  loadSmProjectTag = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSmProjectTag(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.project_id = response.data.project_id;
          this.tag_id = response.data.tag_id;
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


  loadSurveyTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSurveyTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SurveyTags = response.data
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
