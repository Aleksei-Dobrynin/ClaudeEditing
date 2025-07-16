import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getWorkflowTaskTemplate } from "api/WorkflowTaskTemplate/useGetWorkflowTaskTemplate";
import { createWorkflowTaskTemplate } from "api/WorkflowTaskTemplate/useCreateWorkflowTaskTemplate";
import { updateWorkflowTaskTemplate } from "api/WorkflowTaskTemplate/useUpdateWorkflowTaskTemplate";
import { getStructures } from "../../../api/Structure/useGetStructures";

class NewStore {
  id = 0;
  workflow_id = 0;
  idWorkflow = 0;
  name = "";
  order = 0;
  is_active = false;
  is_required = false;
  description = "";
  structure_id = 0;
  errorworkflow_id = "";
  errorname = "";
  errororder = "";
  erroris_active = "";
  erroris_required = "";
  errordescription = "";
  errorstructure_id = "";
  Structures = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.workflow_id = 0;
      this.idWorkflow = 0;
      this.name = "";
      this.order = 0;
      this.is_active = false;
      this.is_required = false;
      this.description = "";
      this.structure_id = 0;
      this.errorworkflow_id = "";
      this.errorname = "";
      this.errororder = "";
      this.erroris_active = "";
      this.erroris_required = "";
      this.errordescription = "";
      this.errorstructure_id = "";
      this.Structures = [];
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
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          workflow_id: this.idWorkflow,
          name: this.name,
          order: this.order,
          is_active: this.is_active,
          is_required: this.is_required,
          description: this.description,
          structure_id: this.structure_id
        };

        const response = data.id === 0
          ? await createWorkflowTaskTemplate(data)
          : await updateWorkflowTaskTemplate(data);

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

  loadWorkflowTaskTemplate = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplate(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.workflow_id = response.data.workflow_id;
          this.name = response.data.name;
          this.order = response.data.order;
          this.is_active = response.data.is_active;
          this.is_required = response.data.is_required;
          this.description = response.data.description;
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

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structures = response.data;
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
    this.loadStructures()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadWorkflowTaskTemplate(id);
  }
}

export default new NewStore();
