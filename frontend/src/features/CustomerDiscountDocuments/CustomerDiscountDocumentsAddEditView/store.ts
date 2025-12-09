import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomerDiscountDocuments, createCustomerDiscountDocuments, updateCustomerDiscountDocuments } from "api/CustomerDiscountDocuments";
import store from "../CustomerDiscountDocumentsListView/store";
import { getDiscountDocumentss } from "../../../api/DiscountDocuments";

class NewStore {
  id = 0;
  customer_discount_id = 0;
  discount_documents_id = 0;
  discountDocuments = [];
  errorcustomer_discount_id = "";
  errordiscount_documents_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.customer_discount_id = 0;
      this.discount_documents_id = 0;
      this.errorcustomer_discount_id = "";
      this.errordiscount_documents_id = "";
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

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          customer_discount_id: this.customer_discount_id,
          discount_documents_id: this.discount_documents_id,
        };

        const response = data.id === 0
          ? await createCustomerDiscountDocuments(data)
          : await updateCustomerDiscountDocuments(data);

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

  loadCustomerDiscountDocuments = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomerDiscountDocuments(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.customer_discount_id = response.data.customer_discount_id;
          this.discount_documents_id = response.data.discount_documents_id;
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

  loadDiscountDocumentss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDiscountDocumentss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.discountDocuments = response.data;
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
    this.loadDiscountDocumentss()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadCustomerDiscountDocuments(id);
  }
}

export default new NewStore();
