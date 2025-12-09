import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getDiscountDocuments, createDiscountDocuments, updateDiscountDocuments } from "api/DiscountDocuments";
import { getDiscountTypes } from "api/DiscountType";
import { getDiscountDocumentTypes } from "api/DiscountDocumentType";

class NewStore {
  id = 0;
  file_id = 0;
  description = "";
  discount = 0;
  discount_type_id = 0;
  document_type_id = 0;
  start_date = null;
  end_date = null;
  files = [];
  FileName = "";
  File = null;
  errorFileName = "";
  idDocumentinputKey = "";
  discount_types = [];
  document_types = [];
  errorfile_id = "";
  errordescription = "";
  errordiscount = "";
  errordiscount_type_id = "";
  errordocument_type_id = "";
  errorstart_date = "";
  errorend_date = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.file_id = 0;
      this.description = "";
      this.discount = 0;
      this.discount_type_id = 0;
      this.document_type_id = 0;
      this.start_date = null;
      this.end_date = null;
      this.files = [];
      this.discount_types = [];
      this.document_types = [];
      this.errorfile_id = "";
      this.errordescription = "";
      this.errordiscount = "";
      this.errordiscount_type_id = "";
      this.errordocument_type_id = "";
      this.errorstart_date = "";
      this.errorend_date = "";
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
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          file_id: this.file_id,
          description: this.description,
          discount: this.discount,
          discount_type_id: this.discount_type_id,
          document_type_id: this.document_type_id,
          start_date: this.start_date,
          end_date: this.end_date
        };

        const response = data.id === 0
          ? await createDiscountDocuments(data, this.File, this.FileName)
          : await updateDiscountDocuments(data, this.File, this.FileName);

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

  loadDiscountDocuments = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getDiscountDocuments(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.file_id = response.data.file_id;
          this.description = response.data.description;
          this.discount = response.data.discount;
          this.discount_type_id = response.data.discount_type_id;
          this.document_type_id = response.data.document_type_id;
          this.start_date = response.data.start_date;
          this.end_date = response.data.end_date;
          this.FileName = response.data.file_name;
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

  loadDiscountType = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDiscountTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.discount_types = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDiscountDocumentType = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDiscountDocumentTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.document_types = response.data;
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
    await this.loadDiscountType();
    await this.loadDiscountDocumentType();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadDiscountDocuments(id);
  }
}

export default new NewStore();
