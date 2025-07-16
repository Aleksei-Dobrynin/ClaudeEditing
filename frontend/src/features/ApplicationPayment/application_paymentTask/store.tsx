import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getapplication_payment } from "api/application_payment";
import { createapplication_payment } from "api/application_payment";
import { updateapplication_payment } from "api/application_payment";
import { downloadFile } from "api/File";
import MainLayoutStore from "layouts/MainLayout/store";
// dictionaries

import { getMyOrgStructures, getorg_structures } from "api/org_structure";

import { getApplications } from "api/Application/useGetApplications";
import { getEmployeeInStructureGroup } from "../../../api/EmployeeInStructure/useGetEmployeeInStructure";
import { getSystemSettingByCodes } from "../../../api/SystemSetting";
import { number } from "yup";
import { getByApplicationAndStructure } from "../../../api/ServicePrice";


class NewStore {
  filterStructureId = 0;

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
  is_manual_entry_nds = false;
  nds = 0;
  nds_value = 0;
  is_manual_entry_nsp = false;
  is_free_calc = false;
  nsp = 0;
  nsp_value = 0;
  file_id = 0;
  reason = "";
  is_percentage = false;
  openPanelDocument = false
  FileName = "";
  File = null;
  idTask = 0;
  serice_price = 0;
  idDocumentinputKey = Math.random().toString(36);
  employeeInStructure = [];
  systemSettings = [];
  head_structure_id = 0;
  implementer_id = 0;
  errors: { [key: string]: string } = {};

  // Справочники
  org_structures = []
  applications = []
  openPrint = false;


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
      this.is_manual_entry_nds = false;
      this.nds = 0;
      this.nds_value = 0;
      this.is_manual_entry_nsp = false;
      this.is_free_calc = false;
      this.nsp = 0;
      this.nsp_value = 0;
      this.file_id = 0;
      this.serice_price = 0;
      this.reason = "";
      this.is_percentage = false;
      this.FileName = "";
      this.File = null;
      this.idDocumentinputKey = Math.random().toString(36);
      this.employeeInStructure = [];
      this.systemSettings = [];
      this.head_structure_id = 0;
      this.implementer_id = 0;
      this.errors = {}

      this.openPanelDocument = false;
    });
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
    this.calculateSum()
  }

  handleChangeNumber(event) {
    let { name, value } = event.target;

    if (!value) {
      (this as any)[name] = 0;
      this.validateField(name, 0);
      this.calculateSum();
      return;
    }

    // Заменяем запятую на точку
    if (typeof value === 'string' && value.includes(',')) {
      value = value.replace(',', '.');
    }

    // КЛЮЧ: НЕ преобразуем в число! Оставляем строку как есть
    (this as any)[name] = value;

    // Для валидации и расчетов используем parseFloat
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      this.validateField(name, numValue);
      this.calculateSum();
    }
  }

  async calculateSum() {
    let totalSum = 0;
    if (this.is_percentage) {
      this.discount_value = 0;
      this.discount_percentage_value = Math.round(((this.discount_percentage / 100.0) * Number(this.sum_wo_discount)) * 100) / 100;
      totalSum = this.sum_wo_discount - this.discount_percentage_value;
    } else {
      this.discount_percentage = 0;
      this.discount_percentage_value = 0;
      totalSum = Number(this.sum_wo_discount) - this.discount_value;
    }
    this.nds_value = Math.round(Number(totalSum) * (this.nds / 100) * 100) / 100;
    this.nsp_value = Math.round(Number(totalSum) * (this.nsp / 100) * 100) / 100;
    console.log(`totalSum: ${totalSum}`);
    this.sum = Math.round((totalSum + this.nds_value + this.nsp_value) * 100) / 100;
  }

  async validateField(name: string, value: any) {
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

  loadEmployeeInStructure = async (structure_id: number) => {
    try {
      MainStore.changeLoader(true);
      if (
        this.filterStructureId == 239 ||
        this.filterStructureId == 240 ||
        this.filterStructureId == 241 ||
        this.filterStructureId == 224 ||
        this.filterStructureId == 242) {

        let employeeInStructure = await this.loadEmployeeInStructure2(239);
        employeeInStructure = [...employeeInStructure, ...await this.loadEmployeeInStructure2(240)];
        employeeInStructure = [...employeeInStructure, ...await this.loadEmployeeInStructure2(241)];
        employeeInStructure = [...employeeInStructure, ...await this.loadEmployeeInStructure2(224)];
        employeeInStructure = [...employeeInStructure, ...await this.loadEmployeeInStructure2(242)];

        employeeInStructure = [...new Map(employeeInStructure.map(item => [item.id, item])).values() as any];

        console.log(employeeInStructure);
        runInAction(() => {
          this.employeeInStructure = employeeInStructure;

          console.log(MainLayoutStore.employee_id);
          this.head_structure_id = employeeInStructure.find(e => (e.structure_id == structure_id) && e.post_name && e.post_name.toLowerCase().includes('начальник'))?.id ?? 0;
          this.implementer_id = employeeInStructure.find(e => (e.structure_id == structure_id) && e.employee_id == MainLayoutStore.employee_id)?.id ?? 0;
        });
      }
      else {
        const response = await getEmployeeInStructureGroup(structure_id);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            this.employeeInStructure = response.data
            this.head_structure_id = this.employeeInStructure.find(e => e.post_name && e.post_name.toLowerCase().includes('начальник'))?.id ?? 0;
            this.implementer_id = this.employeeInStructure.find(e => e.employee_id == MainLayoutStore.employee_id)?.id ?? 0;
          });
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

  loadEmployeeInStructure2 = async (structure_id: number) => {
    const response = await getEmployeeInStructureGroup(structure_id);
    if ((response.status === 201 || response.status === 200) && response?.data !== null) {
      return response.data;
    }
    return [];
  };

  loadSystemSettings = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSystemSettingByCodes(["nds", "nsp"]);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.nds = response.data.find(s => s.code === 'nds')?.value ?? 0;
          this.nsp = response.data.find(s => s.code === 'nsp')?.value ?? 0;
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

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {

      id: this.id - 0,
      application_id: this.application_id - 0,
      description: this.description,
      sum: this.sum,
      structure_id: this.structure_id - 0 === 0 ? null : this.structure_id - 0,
      sum_wo_discount: this.sum_wo_discount,
      discount_percentage: this.discount_percentage,
      discount_value: this.discount_value,
      reason: this.reason,
      nds: Number(this.nds),
      nds_value: Number(this.nds_value),
      nsp: Number(this.nsp),
      nsp_value: Number(this.nsp_value),
      head_structure_id: this.employeeInStructure.find(e => e.id === this.head_structure_id)?.employee_id,
      implementer_id: this.employeeInStructure.find(e => e.id === this.implementer_id)?.employee_id,
      FileName: this.FileName,
      idTask: this.idTask,
      file_id: this.file_id,
    };

    if (this.is_free_calc && (data.FileName == null || data.FileName?.trim() === ""))
      data.FileName = "."

    let sum_wo_discount = data.sum_wo_discount;
    if (this.is_free_calc && data.sum_wo_discount == 0)
      data.sum_wo_discount = 1;

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }
    data.sum_wo_discount = sum_wo_discount;


    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createapplication_payment(data, this.FileName, this.File);
      } else {
        response = await updateapplication_payment(data, this.FileName, this.File);
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
    await this.loadSystemSettings();
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
          this.reason = response.data.reason;
          this.file_id = response.data.file_id;
          this.nds = response.data.nds;
          this.nds_value = response.data.nds_value;
          this.nsp = response.data.nsp;
          this.nsp_value = response.data.nsp_value;
          this.FileName = response.data.file_name;
          this.head_structure_id = this.employeeInStructure.find(e => e.employee_id === response.data.head_structure_id)?.id;
          this.implementer_id = this.employeeInStructure.find(e => e.employee_id === response.data.implementer_id)?.id;
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

  changeOrgStructures = async () => {
    await this.loadEmployeeInStructure(this.structure_id ?? 0);
  };

  loadServicePrice = async (application_id : number, structure_id : number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getByApplicationAndStructure(application_id, structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.serice_price = response.data.price;
          this.sum_wo_discount = response.data.price;
        });
      } else if (response.status === 204) {
        this.serice_price = 0
        return;
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

      if (this.filterStructureId == 239 ||
        this.filterStructureId == 240 ||
        this.filterStructureId == 241 ||
        this.filterStructureId == 224 ||
        this.filterStructureId == 242) {
        let response = await getorg_structures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data.filter(x =>
            x.id == 239 ||
            x.id == 240 ||
            x.id == 241 ||
            x.id == 224 ||
            x.id == 242
          );


          await this.loadEmployeeInStructure(response.data[0].id ?? 0);
        } else {
          throw new Error();
        }
      } else {
        const response = await getMyOrgStructures();
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.org_structures = response.data
          this.structure_id = response.data[0].id;
          console.log(this.structure_id);
          await this.loadServicePrice(this.application_id, response.data[0].id ?? 0);
          await this.loadEmployeeInStructure(response.data[0].id ?? 0);
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



  loadorg_structuresAll = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data.filter(x => x.id == 239 ||
          x.id == 240 ||
          x.id == 241 ||
          x.id == 224 ||
          x.id == 242)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        if (response.data.fileContents === "" || response.data.fileContents === null) {
          MainStore.openErrorDialog(i18n.t("message:error.fileNotFoundInDatabase"));
          return;
        }
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
