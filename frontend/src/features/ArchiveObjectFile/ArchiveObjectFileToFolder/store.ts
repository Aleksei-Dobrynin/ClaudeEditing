import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveObjectFile } from "api/ArchiveObjectFile/useGetArchiveObjectFile";
import {
  createArchiveObjectFile,
  sendFilesToFolder,
} from "api/ArchiveObjectFile/useCreateArchiveObjectFile";
import { updateArchiveObjectFile } from "api/ArchiveObjectFile/useUpdateArchiveObjectFile";
import { getArchiveObjects } from "api/ArchiveObject/useGetArchiveObjects";
import { getarchive_folders, getarchive_foldersByObjId } from "api/archive_folder";

class NewStore {
  id = 0;
  archive_object_id = 0;
  archive_folder_id = 0;
  errorarchive_object_id = "";
  openAddFolder = false;
  errorarchive_folder_id = "";
  file_id = 0;
  name = "";
  errorfile_id = "";
  errorname = "";
  FileName = "";
  File = null;
  idDocumentinputKey = "";
  errorFileName = "";
  ArchiveFolders = [];
  ArchiveObjects = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.archive_object_id = 0;
      this.file_id = 0;
      this.name = "";
      this.errorarchive_object_id = "";
      this.errorfile_id = "";
      this.errorname = "";
      this.File = null;
      this.FileName = "";
      this.idDocumentinputKey = "";
      this.errorFileName = "";
      this.archive_folder_id = 0;
      this.archive_object_id = 0;
      this.errorarchive_object_id = "";
      this.errorarchive_folder_id = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  onSaveClick = async (onSaved: (id: number) => void, file_ids: number[]) => {
    try {
      MainStore.changeLoader(true);

      const response = await sendFilesToFolder(file_ids, this.archive_folder_id);

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

  loadArchiveObjectFile = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectFile(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.archive_object_id = response.data.archive_object_id;
          this.file_id = response.data.file_id;
          this.name = response.data.name;
          this.archive_object_id = response.data.archive_object_id;
          this.archive_folder_id = response.data.archive_folder_id;
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

  loadArchiveObjects = async (search?: string) => {
    try {
      MainStore.changeLoader(true);
      // const response = await getArchObjectsBySearch(search);
      const response = await getArchiveObjects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveObjects = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadArchiveFolders = async () => {
    try {
      MainStore.changeLoader(true);
      // const response = await getArchObjectsBySearch(search);
      const response = await getarchive_foldersByObjId(this.archive_object_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveFolders = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(obj_id: number) {
    this.archive_object_id = obj_id
    this.loadArchiveFolders();
  }
}

export default new NewStore();
