import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getEmployeeInStructure } from "api/EmployeeInStructure/useGetEmployeeInStructure";
import { createEmployeeInStructure } from "api/EmployeeInStructure/useCreateEmployeeInStructure";
import { updateEmployeeInStructure } from "api/EmployeeInStructure/useUpdateEmployeeInStructure";
import { getStructurePosts } from "api/StructurePost/useGetStructurePosts";

import { getStructures } from "api/Structure/useGetStructures";
import storeList from "../EmployeeStructuresListView/store"

class NewStore {
  id = 0;
  employee_id = 0;
  date_start = null;
  date_end = null;
  structure_id = 0;
  post_id = 0;
  is_temporary = false;
  erroremployee_id = "";
  errordate_start = "";
  errordate_end = "";
  errorstructure_id = "";
  errorpost_id = "";
  erroris_temporary = "";
  Employees = [];
  Structures = [];
  StructurePost = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.employee_id = 0;
      this.date_start = null;
      this.date_end = null;
      this.structure_id = 0;
      this.post_id = 0;
      this.is_temporary = false;
      this.erroremployee_id = "";
      this.errordate_start = "";
      this.errordate_end = "";
      this.errorstructure_id = "";
      this.errorpost_id = "";
      this.erroris_temporary = "";
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
    event = {
      target: { name: "date_start", value: this.date_start }
    };
    canSave = validate(event) && canSave;
    event = {
      target: { name: "structure_id", value: this.structure_id }
    };
    canSave = validate(event) && canSave;
    event = {
      target: { name: "post_id", value: this.post_id }
    };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          employee_id: this.employee_id - 0,
          date_start: this.date_start,
          date_end: this.date_end,
          structure_id: this.structure_id- 0,
          post_id: this.post_id- 0,
          is_temporary: this.is_temporary
        };

        const response = data.id === 0
          ? await createEmployeeInStructure(data)
          : await updateEmployeeInStructure(data);

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

  loadStructurePost = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructurePosts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.StructurePost = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEmployeeInStructure = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructure(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.employee_id = response.data.employee_id;
          this.date_start = response.data.date_start;
          this.date_end = response.data.date_end;
          this.structure_id = response.data.structure_id;
          this.post_id = response.data.post_id;
          this.is_temporary = response.data.is_temporary;
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
    this.loadStructures()
    this.loadStructurePost()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadEmployeeInStructure(id);
  }
}

export default new NewStore();
