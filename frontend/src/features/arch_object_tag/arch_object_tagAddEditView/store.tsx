import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getObjectTag } from "api/arch_object_tag";
import { createObjectTag } from "api/arch_object_tag";
import { updateObjectTag } from "api/arch_object_tag";

// dictionaries
import { getTags } from "api/Tag/useGetTags";

import storeList from "features/arch_object_tag/arch_object_tagListView/store"


class NewStore {
  id = 0
  value = ""
  id_object: 0
  id_tag:  number[]
  allow_notification = false


  errors: { [key: string]: string } = {};

  // Справочники
  tags = []


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.value = ""
      this.id_object = 0
      this.id_tag = []
      this.allow_notification = false

      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    if(name == "type_id"){
      this.id_tag = value
    }
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      value: this.value,
      id_object: storeList.idMain,
      id_tag: [], // TODO LOAD TAGS
      allow_notification: this.allow_notification,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createObjectTag(data);
      } else {
        response = await updateObjectTag(data);
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
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadTags();
    this.id = id;

    if (id === null || id === 0) {
      return;
    }

    this.loadarch_object_tag(id);
  }

  loadTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.tags = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadarch_object_tag = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getObjectTag(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.value = response.data.value;
          this.id_tag = response.data.id_tag;
          this.allow_notification = response.data.allow_notification;
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

  changeTags(ids: number[]) {
    this.id_tag = ids;
  }



}

export default new NewStore();
