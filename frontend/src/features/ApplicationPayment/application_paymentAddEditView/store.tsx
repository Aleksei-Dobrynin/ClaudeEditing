import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_payment } from "api/application_payment";
import { createapplication_payment } from "api/application_payment";
import { updateapplication_payment } from "api/application_payment";
import { downloadFile } from "api/File";

// dictionaries

import { getMyOrgStructures, getorg_structures } from "api/org_structure";

import { getApplications } from "api/Application/useGetApplications";
import { number } from "yup";


class NewStore {
  id = 0
  application_id = 0
  description = ""
  sum = 0
  structure_id = 0
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  discount_percentage = 0;
  discount_percentage_value = 0;
  discount_value = 0;
  sum_wo_discount = 0;
  reason = "";
  is_percentage = false;
  isOpenFileView = false;
  fileType = '';
  fileUrl = null;

  errors: { [key: string]: string } = {};

  // Справочники
  org_structures = []
  applications = []



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.application_id = 0
      this.description = ""
      this.sum = 0
      this.structure_id = 0
      this.created_at = ""
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0
      this.discount_percentage = 0;
      this.discount_percentage_value = 0;
      this.discount_value = 0;
      this.sum_wo_discount = 0;
      this.reason = "";
      this.is_percentage = false;
      this.errors = {}
    });
  }

  handleChange(event) {
    let { name, value } = event.target;
    if (name === "sum") {
      if (/^0(\.\d*)?$/.test(value)) {
        
      }else if (/^0+\.\d+$/.test(value)) {
        value = '0' + value.slice(value.indexOf('.'));
      }else{
        value = value.replace(/^0+/, '');
      } 
    }
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  async validateField(name: string, value: any,) {
    let subValue = {
      discount_percentage: this.discount_percentage,
      discount_value: this.discount_value,
      sum_wo_discount: this.sum_wo_discount,
    }
    const { isValid, error } = await validateField(name, value, subValue);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      application_id: this.application_id - 0,
      description: this.description,
      sum: this.sum,
      sum_wo_discount: this.sum_wo_discount,
      discount_percentage: this.discount_percentage,
      discount_value: this.discount_value,
      structure_id: this.structure_id - 0 === 0 ? null : this.structure_id - 0,
      reason: this.reason
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
        response = await createapplication_payment(data);
      } else {
        response = await updateapplication_payment(data);
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
    await this.loadorg_structures();


    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadapplication_payment(id);
  }

  loadapplication_payment = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_payment(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.application_id = response.data.application_id;
          this.description = response.data.description;
          this.sum = response.data.sum;
          this.structure_id = response.data.structure_id;
          this.created_at = dayjs(response.data.created_at);
          this.updated_at = dayjs(response.data.updated_at);
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.sum_wo_discount = response.data.sum_wo_discount;
          this.discount_percentage = response.data.discount_percentage;
          this.discount_value = response.data.discount_value;
          this.reason = response.data.reason
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


  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);

      if (MainStore.isFinancialPlan) {
        const response = await getorg_structures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data.filter(x => x.order_number != null).sort((a, b) => a.order_number - b.order_number);
        } else {
          throw new Error();
        }
      }
      else {
        const response = await getMyOrgStructures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data
        } else {
          throw new Error();
        }
      }
 
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async OpenFileFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let mimeType = 'application/pdf';
        this.fileType = 'pdf';
        if (fileName.endsWith('.png')) {
          mimeType = 'image/png';
          this.fileType = 'png';
        }
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
          this.fileType = 'jpg';
        }
        const blob = new Blob([byteArray], { type: mimeType });
        this.fileUrl = URL.createObjectURL(blob);
        this.isOpenFileView = true;
        return
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.data.contentType || 'application/octet-stream' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.fileDownloadName || fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

}

export default new NewStore();
