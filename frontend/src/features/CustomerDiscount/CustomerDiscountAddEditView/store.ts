import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomerDiscount, createCustomerDiscount, updateCustomerDiscount } from "api/CustomerDiscount";
import { getCustomersBySearch } from "../../../api/Customer/useGetCustomers";

class NewStore {
  id = 0;
  pin_customer = "";
  description = "";
  customer_id = 0;
  customerLoading = false;
  customerInputValue = "";
  Customers = [];
  errorpin_customer = "";
  errordescription = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.pin_customer = "";
      this.description = "";
      this.errorpin_customer = "";
      this.errordescription = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  changeCustomerInput(value: string) {
    if (value !== this.customerInputValue) {
      this.customerInputValue = value;
    }
  }

  loadCustomers = async () => {
    try {
      const response = await getCustomersBySearch(this.customerInputValue);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Customers = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.customerLoading = false;
    }
  };

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "pin_customer", value: this.pin_customer } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          pin_customer: this.pin_customer,
          description: this.description,
        };

        const response = data.id === 0
          ? await createCustomerDiscount(data)
          : await updateCustomerDiscount(data);

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

  loadCustomerDiscount = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerDiscount(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.pin_customer = response.data.pin_customer;
          this.customerInputValue = response.data.pin_customer;
          this.description = response.data.description;
        });
        this.loadCustomers()
        this.customer_id = this.Customers.find(c => c.pin === this.pin_customer)?.id;
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
    this.loadCustomerDiscount(id);
  }
}

export default new NewStore();
