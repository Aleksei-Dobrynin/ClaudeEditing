import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getEmployee } from "api/Employee/useGetEmployee";
// import { getContactTypes } from "api/ContactType/useGetContactTypes";
import { createEmployee, createUser } from "api/Employee/useCreateEmployee";
import { updateEmployee } from "api/Employee/useUpdateEmployee";
import { getcontact_types } from "api/contact_type";
import { getFilledTemplate } from "api/org_structure";
import printJS from "print-js";

class NewStore {
  id = 0;
  last_name = "";
  first_name = "";
  email = "";
  second_name = "";
  pin = "";
  remote_id = "";
  user_id = "";
  errorlast_name = "";
  errorfirst_name = "";
  errorsecond_name = "";
  errorpin = "";
  errorremote_id = "";
  erroruser_id = "";
  contactTypes = [];

  curentContactValue = "";
  errorcurentContactValue = "";
  curentContactType = 0;
  errorcurentContactType = "";


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.last_name = "";
      this.first_name = "";
      this.email = "";
      this.second_name = "";
      this.pin = "";
      this.remote_id = "";
      this.user_id = "";
      this.errorlast_name = "";
      this.errorfirst_name = "";
      this.errorsecond_name = "";
      this.errorpin = "";
      this.errorremote_id = "";
      this.erroruser_id = "";
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
    event = { target: { name: "last_name", value: this.last_name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "first_name", value: this.first_name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "second_name", value: this.second_name } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          last_name: this.last_name,
          first_name: this.first_name,
          email: this.email,
          second_name: this.second_name,
          pin: this.pin,
          remote_id: this.remote_id,
          user_id: this.user_id
        };

        const response = data.id === 0
          ? await createEmployee(data)
          : await updateEmployee(data);

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

  loadContactTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontact_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.contactTypes = response.data;
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

  loadEmployee = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployee(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.last_name = response.data.last_name;
          this.first_name = response.data.first_name;
          this.email = response.data.email;
          this.second_name = response.data.second_name;
          this.pin = response.data.pin;
          this.remote_id = response.data.remote_id;
          this.user_id = response.data.user_id;
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
    this.loadContactTypes();
    this.loadEmployee(id);
  }

  async printDocument(idDocument: number, parameters: {}) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplate(idDocument, "ru", parameters);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: "raw-html",
          targetStyles: ["*"]
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

  registerEmployee = async () => {
    try {
      MainStore.changeLoader(true);
      var data = {
        id: this.id,
        email: this.email
      }
      const response = await createUser(data);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        this.doLoad(this.id);
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
