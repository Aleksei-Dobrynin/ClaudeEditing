import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getWorkflow } from "api/Workflow/useGetWorkflow";
import { createWorkflow } from "api/Workflow/useCreateWorkflow";
import { updateWorkflow } from "api/Workflow/useUpdateWorkflow";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  name = "";
  is_active = false;
  date_start = null;
  date_end = null;
  errorname = "";
  errordate_start = "";
  errordate_end = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.is_active = false;
      this.date_start = null;
      this.date_end = null;
      this.errorname = "";
      this.errordate_start = "";
      this.errordate_end = "";
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
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;

    event = { target: { name: "date_start", value: this.date_start } };
    canSave = validate(event) && canSave;
    event = { target: { name: "date_end", value: this.date_end } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          is_active: this.is_active,
          date_start:this.date_start !== null ? dayjs(new Date(this.date_start)).format("YYYY-MM-DDThh:mm:ss") : null,
          date_end: this.date_end !== null ?  dayjs(new Date(this.date_end )).format("YYYY-MM-DDThh:mm:ss") : null,
        };
        console.log(this.date_start)
        console.log(this.date_end)
        console.log(data)
        const response = data.id === 0
          ? await createWorkflow(data)
          : await updateWorkflow(data);


        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
          if (data.id === 0) {
            this.id = response.data.id;
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

  loadWorkflow = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflow(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.is_active = response.data.is_active;
          this.date_start =response.data.date_start ? dayjs(response.data.date_start) : null;
          this.date_end = response.data.date_end ? dayjs(response.data.date_end) : null;

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
    this.loadWorkflow(id);

  }
}

export default new NewStore();
