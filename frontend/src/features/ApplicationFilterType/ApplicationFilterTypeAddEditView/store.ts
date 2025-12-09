import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationFilterType } from "api/ApplicationFilterType/useGetApplicationFilterType";
import { createApplicationFilterType } from "api/ApplicationFilterType/useCreateApplicationFilterType";
import { updateApplicationFilterType } from "api/ApplicationFilterType/useUpdateApplicationFilterType";
import { getorg_structures } from "../../../api/org_structure";
import { getStructurePosts } from "../../../api/StructurePost/useGetStructurePosts";

class NewStore {
  id = 0;
  name = "";
  description = "";
  code = "";
  post_id = 0;
  structure_id = 0;
  orgPosts = [];
  orgStructure = [];
  errorname = "";
  errordescription = "";
  errorcode = "";
  errorpost_id = "";
  errorstructure_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.description = "";
      this.code = "";
      this.post_id = 0;
      this.structure_id = 0;
      this.orgPosts = [];
      this.orgStructure = [];
      this.errorname = "";
      this.errordescription = "";
      this.errorcode = "";
      this.errorpost_id = "";
      this.errorstructure_id = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    console.log(event.target.name)
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
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          description: this.description,
          code: this.code,
          post_id: this.post_id,
          structure_id: this.structure_id,
        };

        const response = data.id === 0
          ? await createApplicationFilterType(data)
          : await updateApplicationFilterType(data);

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

  loadStructurePosts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructurePosts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.orgPosts = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.orgStructure = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadApplicationFilterType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationFilterType(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
            this.post_id = response.data.post_id;
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
    this.loadStructurePosts();
    this.loadStructures();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadApplicationFilterType(id);
  }
}

export default new NewStore();
