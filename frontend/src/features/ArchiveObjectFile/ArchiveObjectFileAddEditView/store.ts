import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveObjectFile } from "api/ArchiveObjectFile/useGetArchiveObjectFile";
import { createArchiveObjectFile } from "api/ArchiveObjectFile/useCreateArchiveObjectFile";
import { updateArchiveObjectFile } from "api/ArchiveObjectFile/useUpdateArchiveObjectFile";
import { getArchiveObjects } from "api/ArchiveObject/useGetArchiveObjects";
import { getarchive_folders } from "api/archive_folder";


class NewStore {
  id = 0;
  archive_object_id = 0;
  archive_folder_id = 0;
  errorarchive_object_id = "";
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
      this.archive_folder_id = 0
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

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "FileName", value: this.FileName } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          archive_object_id: this.archive_object_id,
          archive_folder_id: this.archive_folder_id,
          file_id: this.file_id,
          name: this.name,
        };

        const response = data.id === 0
          ? await createArchiveObjectFile(data, this.File, this.FileName)
          : await updateArchiveObjectFile(data, this.File, this.FileName);

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
      const response = await getarchive_folders();
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

  }

  async doLoad(id: number) {

    this.loadArchiveFolders()
    // this.loadArchiveObjects()

    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadArchiveObjectFile(id);
  }
}

export default new NewStore();
