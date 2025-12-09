import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getAddressUnitType, createAddressUnitType, updateAddressUnitType } from "api/AddressUnitType";

class NewStore {
  id = 0;
  name = "";
  description = "";
  code = "";
  name_kg = "";
  description_kg = "";
  created_at = null;
  updated_at = null;
  created_by = 0;
  updated_by = 0;
  
  errorname = "";
  errordescription = "";
  errorcode = "";
  errorname_kg = "";
  errordescription_kg = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.description = "";
      this.code = "";
      this.name_kg = "";
      this.description_kg = "";
      this.created_at = null;
      this.updated_at = null;
      this.created_by = 0;
      this.updated_by = 0;
      this.errorname = "";
      this.errordescription = "";
      this.errorcode = "";
      this.errorname_kg = "";
      this.errordescription_kg = "";
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
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "name_kg", value: this.name_kg } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description_kg", value: this.description_kg } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          description: this.description,
          code: this.code,
          name_kg: this.name_kg,
          description_kg: this.description_kg,
        };

        const response = data.id === 0 ? await createAddressUnitType(data) : await updateAddressUnitType(data);
        if (response.status === 201 || response.status === 200) {
          onSaved(response.data.id);
          console.log(i18n.language);
          if (data.id === 0) {
            this.id = response.data.id;
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

  loadAddressUnitType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getAddressUnitType(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.name_kg = response.data.name_kg;
          this.description_kg = response.data.description_kg;
          this.created_at = response.data.created_at;
          this.updated_at = response.data.updated_at;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
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
    this.loadAddressUnitType(id);
  }
}

export default new NewStore();