import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationInvoice, createApplicationInvoice, updateApplicationInvoice } from "api/ApplicationInvoice";

class NewStore {
  id = 0;
  application_id = 0;
  status_id = 0;
  sum = 0;
  nds = 0;
  nsp = 0;
  discount = 0;
  total_sum = 0;
  errorapplication_id = '';
  errorstatus_id = '';
  errorsum = '';
  errornds = '';
  errornsp = '';
  errordiscount = '';
  errortotal_sum = '';

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.application_id = 0;
      this.status_id = 0;
      this.sum = 0;
      this.nds = 0;
      this.nsp = 0;
      this.discount = 0;
      this.total_sum = 0;
      this.errorapplication_id = '';
      this.errorstatus_id = '';
      this.errorsum = '';
      this.errornds = '';
      this.errornsp = '';
      this.errordiscount = '';
      this.errortotal_sum = '';
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
    event = { target: { name: "application_id", value: this.application_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "status_id", value: this.status_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "sum", value: this.sum } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          application_id: this.application_id,
          status_id: this.status_id,
          sum: this.sum,
          nds: this.nds,
          nsp: this.nsp,
          discount: this.discount,
          total_sum: this.total_sum,
        };

        const response = data.id === 0
          ? await createApplicationInvoice(data)
          : await updateApplicationInvoice(data);

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

  loadApplicationInvoice = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationInvoice(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.application_id = response.data.application_id;
          this.status_id = response.data.status_id;
          this.sum = response.data.sum;
          this.nds = response.data.nds;
          this.nsp = response.data.nsp;
          this.discount = response.data.discount;
          this.total_sum = response.data.total_sum;
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
    if (id == null || id === 0) {
      return;
    }
    this.id = id;
    this.loadApplicationInvoice(id);
  }
}

export default new NewStore();
