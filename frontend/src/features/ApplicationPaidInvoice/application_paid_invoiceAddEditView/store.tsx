import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_paid_invoice } from "api/application_paid_invoice";
import { createapplication_paid_invoice } from "api/application_paid_invoice";
import { updateapplication_paid_invoice } from "api/application_paid_invoice";

 // dictionaries


class NewStore {
  id = 0
	date = null
	payment_identifier = ""
	sum = 0
	application_id = 0
	bank_identifier = ""
	

  errors: { [key: string]: string } = {};

  // Справочники
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
		this.date = null
		this.payment_identifier = ""
		this.sum = 0
		this.application_id = 0
		this.bank_identifier = ""
		
      this.errors = {}
    });
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
    var data = {
      
      id: this.id - 0,
      date: this.date,
      payment_identifier: this.payment_identifier,
      sum: this.sum,
      application_id: this.application_id - 0,
      bank_identifier: this.bank_identifier,
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
        response = await createapplication_paid_invoice(data);
      } else {
        response = await updateapplication_paid_invoice(data);
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
    

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_paid_invoice(id);
  }

  loadapplication_paid_invoice = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_paid_invoice(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          this.date = dayjs(response.data.date);
          this.payment_identifier = response.data.payment_identifier;
          this.sum = response.data.sum;
          this.application_id = response.data.application_id;
          this.bank_identifier = response.data.bank_identifier;
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

  

}

export default new NewStore();
