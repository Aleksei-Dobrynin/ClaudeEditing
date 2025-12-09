import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getWorkflowSubtaskTemplate } from "api/WorkflowSubtaskTemplate/useGetWorkflowSubtaskTemplate";
import { createWorkflowSubtaskTemplate } from "api/WorkflowSubtaskTemplate/useCreateWorkflowSubtaskTemplate";
import { updateWorkflowSubtaskTemplate } from "api/WorkflowSubtaskTemplate/useUpdateWorkflowSubtaskTemplate";

class NewStore {
  id = 0;
  name = "";
  description = "";
  workflow_task_id = 0;
  idWorkflowTaskTemplate = 0;
  errorname = "";
  errordescription = "";
  errorworkflow_task_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.description = "";
      this.workflow_task_id = 0;
      this.idWorkflowTaskTemplate = 0;
      this.errorname = "";
      this.errordescription = "";
      this.errorworkflow_task_id = "";
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
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;
    event = { target: { name: "workflow_task_id", value: this.workflow_task_id } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          description: this.description,
          workflow_task_id: this.idWorkflowTaskTemplate,
        };

        const response = data.id === 0
          ? await createWorkflowSubtaskTemplate(data)
          : await updateWorkflowSubtaskTemplate(data);

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

  loadWorkflowSubtaskTemplate = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowSubtaskTemplate(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.description = response.data.description;
          this.workflow_task_id = response.data.workflow_task_id;
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
    this.loadWorkflowSubtaskTemplate(id);
  }
}

export default new NewStore();
