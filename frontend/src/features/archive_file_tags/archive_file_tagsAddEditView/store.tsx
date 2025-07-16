import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getarchive_file_tags } from "api/archive_file_tags";
import { createarchive_file_tags } from "api/archive_file_tags";
import { updatearchive_file_tags } from "api/archive_file_tags";

// dictionaries


import { getarchive_doc_tags } from "api/archive_doc_tag";
import { getArchiveObjectFile } from "api/ArchiveObjectFile/useGetArchiveObjectFile";
import { setTagsToFile } from "api/ArchiveObjectFile/useCreateArchiveObjectFile";


class NewStore {
  id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  file_id = 0
  tag_id = 0
  tags = []


  errors: { [key: string]: string } = {};

  // Справочники
  archive_object_files = []
  archive_doc_tags = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.created_at = null
      this.updated_at = null
      this.created_by = 0
      this.updated_by = 0
      this.file_id = 0
      this.tag_id = 0

      this.errors = {}
    });
  }

  changeTags(ids: number[]) {
    this.tags = ids;
  }
  handleChange(event) {
    const { name, value } = event.target;
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

    try {
      MainStore.changeLoader(true);
      let response = await setTagsToFile(this.tags, this.file_id);
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(file_id: number) {

    //загрузка справочников
    // await this.loadarchive_object_files();
    await this.loadarchive_doc_tags();


    if (file_id === null || file_id === 0) {
      return;
    }
    this.file_id = file_id;

    this.loadarchive_file_tags(file_id);
  }

  loadarchive_file_tags = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectFile(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.tags = response.data.tags?.map(x => x.id);
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


  // loadarchive_object_files = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getarchive_object_files();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.archive_object_files = response.data
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };

  loadarchive_doc_tags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchive_doc_tags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.archive_doc_tags = response.data
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
