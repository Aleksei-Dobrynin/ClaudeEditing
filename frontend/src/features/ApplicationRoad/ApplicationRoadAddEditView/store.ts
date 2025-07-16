import { makeAutoObservable, runInAction, toJS } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationRoad } from "api/ApplicationRoad/useGetApplicationRoad";
import { createApplicationRoad } from "api/ApplicationRoad/useCreateApplicationRoad";
import { updateApplicationRoad } from "api/ApplicationRoad/useUpdateApplicationRoad";
import { getApplicationRoads } from "../../../api/ApplicationRoad/useGetApplicationRoads";
import { getApplicationStatuss } from "../../../api/ApplicationStatus/useGetApplicationStatuses";
import { getStructurePosts } from "../../../api/StructurePost/useGetStructurePosts";

class NewStore {
  id = 0;
  from_status_id = 0;
  to_status_id = 0;
  group_id = 0;
  rule_expression = "";
  description = "";
  validation_url = "";
  post_function_url = "";
  errordescription = "";
  Statuses = [];
  StructurePost = [];
  selectedPost = [];
  is_active = false;

  from_status_idError = "";
  to_status_idError = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.from_status_id = 0;
      this.to_status_id = 0;
      this.group_id = 0;
      this.rule_expression = "";
      this.description = "";
      this.selectedPost = [];
      this.validation_url = "";
      this.post_function_url = "";
      this.errordescription = "";
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
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;
    event = { target: { name: "from_status_id", value: this.from_status_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "to_status_id", value: this.to_status_id } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          from_status_id: this.from_status_id,
          to_status_id: this.to_status_id,
          rule_expression: this.rule_expression,
          description: this.description,
          validation_url: this.validation_url,
          post_function_url: this.post_function_url,
          is_active: this.is_active,
          posts: this.selectedPost,
          group_id: this.group_id
        };

        const response = data.id === 0
          ? await createApplicationRoad(data)
          : await updateApplicationRoad(data);

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

  loadApplicationRoad = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationRoad(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.from_status_id = response.data.from_status_id;
          this.to_status_id = response.data.to_status_id;
          this.rule_expression = response.data.rule_expression;
          this.description = response.data.description;
          this.validation_url = response.data.validation_url;
          this.post_function_url = response.data.post_function_url;
          this.is_active = response.data.is_active
          this.selectedPost = response.data.posts
          this.group_id = response.data.group_id
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

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Statuses = response.data.filter(x=>x.name);
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
        this.StructurePost = response.data.filter(s => s.code != null);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changePost(ids: number[]) {
    this.selectedPost = ids;
  }

  async doLoad(id: number) {
    this.loadStatuses()
    this.loadStructurePost()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadApplicationRoad(id);
  }
}

export default new NewStore();
