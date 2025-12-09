import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getQueryFilters, createQueryFilters, updateQueryFilters } from "api/QueryFilters";

class NewStore {
  id = 0;
  name = "";
  name_kg = "";
  code = "";
  description = "";
  target_table = "";
  query = "";
  errorname = "";
  errorname_kg = "";
  errorcode = "";
  errordescription = "";
  errortarget_table = "";
  errorquery = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.name_kg = "";
      this.code = "";
      this.description = "";
      this.target_table = "";
      this.query = "";
      this.errorname = "";
      this.errorname_kg = "";
      this.errorcode = "";
      this.errordescription = "";
      this.errortarget_table = "";
      this.errorquery = "";
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
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          name_kg: this.name_kg,
          code: this.code,
          description: this.description,
          target_table: this.target_table,
          query: this.query,
        };

        const response = data.id === 0
          ? await createQueryFilters(data)
          : await updateQueryFilters(data);

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

  loadQueryFilters = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getQueryFilters(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.name_kg = response.data.name_kg;
          this.code = response.data.code;
          this.description = response.data.description;
          this.target_table = response.data.target_table;
          this.query = response.data.query;
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
    this.loadQueryFilters(id);
  }
}

export default new NewStore();
