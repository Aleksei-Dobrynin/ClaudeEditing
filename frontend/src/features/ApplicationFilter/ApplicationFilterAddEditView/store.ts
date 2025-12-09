import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationFilter } from "api/ApplicationFilter/useGetApplicationFilter";
import { createApplicationFilter } from "api/ApplicationFilter/useCreateApplicationFilter";
import { updateApplicationFilter } from "api/ApplicationFilter/useUpdateApplicationFilter";
import { getStructurePosts } from "../../../api/StructurePost/useGetStructurePosts";
import { getApplicationFilterTypes } from "../../../api/ApplicationFilterType/useGetApplicationFilterTypes";

class NewStore {
  id = 0;
  name = "";
  post_id = 0;
  query_id = 0;
  type_id = 0;
  parameters = "";
  description = "";
  code = "";
  errorname = "";
  errorpost_id = "";
  errorquery_id = "";
  errortype_id = "";
  errorparameters = "";
  errordescription = "";
  errorcode = "";
  orgPosts = [];
  filterTypes = [];
  openPanel = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.post_id = 0;
      this.query_id = 0;
      this.type_id = 0;
      this.parameters = "";
      this.description = "";
      this.code = "";
      this.errorname = "";
      this.errorpost_id = "";
      this.errorquery_id = "";
      this.errortype_id = "";
      this.errordescription = "";
      this.errorparameters = "";
      this.errorcode = "";
      this.orgPosts = [];
      this.filterTypes = [];
      this.openPanel = false;
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  async loadStructurePosts() {
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
  };

  loadFilterTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationFilterTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.filterTypes = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
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
          type_id: this.type_id,
          query_id: this.query_id,
          post_id: this.post_id,
          parameters: this.parameters,
        };

        const response = data.id === 0
          ? await createApplicationFilter(data)
          : await updateApplicationFilter(data);

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

  onSaveFilter = async (filter: any) => {
    this.parameters = filter;
  }

  loadApplicationFilter = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationFilter(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.post_id = response.data.post_id;
          this.query_id = response.data.query_id;
          this.type_id = response.data.type_id;
          this.parameters = response.data.parameters;
          this.description = response.data.description;
          this.code = response.data.code;
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
    this.loadFilterTypes();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadApplicationFilter(id);
  }
}

export default new NewStore();
