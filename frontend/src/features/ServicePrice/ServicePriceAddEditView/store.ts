import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getServicePrice, createServicePrice, updateServicePrice, getGetServiceAll } from "api/ServicePrice";
import { getStructures } from "../../../api/Structure/useGetStructures";
import { getServices } from "../../../api/Service/useGetServices";

class NewStore {
  id = 0;
  service_id = 0;
  structure_id = 0;
  price = 0;
  errorservice_id = "";
  errorstructure_id = "";
  errorprice = "";
  Service = [];
  Structure = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.service_id = 0;
      this.structure_id = 0;
      this.price = 0;
      this.errorservice_id = "";
      this.errorstructure_id = "";
      this.errorprice = "";
      this.Service = [];
      this.Structure = [];
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
    event = { target: { name: "price", value: this.price } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          service_id: this.service_id,
          structure_id: this.structure_id,
          price: this.price,
        };

        const response = data.id === 0
          ? await createServicePrice(data)
          : await updateServicePrice(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
            if (data.id === 0) {
              this.id = response.data.id;
              MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
            } else {
              MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
            }
          } else if (response.response.status === 409) {
            MainStore.setSnackbar(i18n.t(`message:error.${response.response.data.message}`), "error");
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

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structure = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getGetServiceAll();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Service = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServicePrice = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getServicePrice(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.service_id = response.data.service_id;
          this.structure_id = response.data.structure_id;
          this.price = response.data.price;
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
    this.loadServices()
    this.loadStructures()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadServicePrice(id);
  }
}

export default new NewStore();
