import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveObject } from "api/ArchiveObject/useGetArchiveObject";
import { createArchiveObject, divideArchiveObject } from "api/ArchiveObject/useCreateArchiveObject";
import dayjs from "dayjs";
import { changeApplicationProcessStatus } from "api/architecture_process";
import { getApplication } from "api/Application/useGetApplication";
import { getCustomer } from "api/Customer/useGetCustomer";
import { Application } from "constants/Application";
import { Customer } from "constants/Customer";

interface DutyPlan {
  id: number;
  address: string;
  number: string;
  archive_folders?: string;
  point: [number, number];
}

interface DivisionObject {
  doc_number: string;
  address: string;
  errordoc_number: string;
  erroraddress: string;
}

class NewStore {
  id = 0;
  doc_number = "";
  address = "";
  customer = "";

  description = "";
  latitude = 0;
  point = [];
  longitude = 0;
  mapLayers: any[] = [];
  date_setplan = null;
  quantity_folder = 0;
  status_dutyplan_object_id = 0;
  archirecture_process_status_code = "";
  archirecture_process_id = 0;
  archirecture_process_status_id = 0;
  errordoc_number = "";
  erroraddress = "";
  errorcustomer = "";
  errordescription = "";
  errordp_outgoing_number = "";
  erroroutgoing_number = "";
  errorlatitude = "";
  errorlongitude = "";
  errordutyPlanObjectNumber = "";

  xcoordinate = 0;
  ycoordinate = 0;
  Application: Application = null;
  Customer: Customer = null;

  ArchitectureStatuses = [];
  ArchitectureRoads = [];
  DarekSearchList = [];
  geometry = [];
  addressInfo = [];
  identifier = "";
  darek_eni = "";
  fileIds = []

  divideObjectPopup = false;

  // Новые поля для разделения на несколько объектов
  divisionObjects: DivisionObject[] = [
    { doc_number: "", address: "", errordoc_number: "", erroraddress: "" },
    { doc_number: "", address: "", errordoc_number: "", erroraddress: "" }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.doc_number = "";
      this.address = "";
      this.customer = "";
      this.description = "";
      this.latitude = 0;
      this.longitude = 0;
      this.mapLayers = [];
      this.errordoc_number = "";
      this.erroraddress = "";
      this.errorcustomer = "";
      this.errordescription = "";
      this.errorlatitude = "";
      this.errorlongitude = "";
      this.errordp_outgoing_number = "";
      this.date_setplan = null;
      this.quantity_folder = 0;
      this.status_dutyplan_object_id = 0;
      this.archirecture_process_id = 0;
      this.archirecture_process_status_id = 0;
      this.mapLayers = [];
      this.Application = null;
      
      // Сброс объектов разделения
      this.divisionObjects = [
        { doc_number: "", address: "", errordoc_number: "", erroraddress: "" },
        { doc_number: "", address: "", errordoc_number: "", erroraddress: "" }
      ];
    });
  }

  // Добавить новый объект для разделения
  addDivisionObject = () => {
    this.divisionObjects.push({
      doc_number: "",
      address: "",
      errordoc_number: "",
      erroraddress: ""
    });
  };

  // Удалить объект разделения (минимум должно остаться 2)
  removeDivisionObject = (index: number) => {
    if (this.divisionObjects.length > 2) {
      this.divisionObjects.splice(index, 1);
    }
  };

  // Обновить поле в объекте разделения
  updateDivisionObject = (index: number, field: keyof DivisionObject, value: string) => {
    if (this.divisionObjects[index]) {
      this.divisionObjects[index][field] = value;
    }
  };

  // Валидация объекта разделения
  validateDivisionObject = (index: number, field: string, value: string): boolean => {
    let isValid = true;
    let errorMessage = "";

    if (field === "doc_number") {
      if (!value || value.trim() === "") {
        errorMessage = i18n.t("Обязательное поле");
        isValid = false;
      }
      this.divisionObjects[index].errordoc_number = errorMessage;
    } else if (field === "address") {
      if (!value || value.trim() === "") {
        errorMessage = i18n.t("Обязательное поле");
        isValid = false;
      }
      this.divisionObjects[index].erroraddress = errorMessage;
    }

    return isValid;
  };

  async changeToStatus(id: number, status_code: string) {
    try {
      MainStore.changeLoader(true);
      const response = await changeApplicationProcessStatus(this.archirecture_process_id, id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.archirecture_process_status_id = id;
      } else if (response?.response?.status === 422) {
        const message = JSON.parse(response?.response?.data?.errorMessage);
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!");
      } else {
        throw new Error();
      }
    } catch (err) {
      const serverMessage = err?.message || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(serverMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  // Обработка изменений в объектах разделения
  handleDivisionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.updateDivisionObject(index, name as keyof DivisionObject, value);
    this.validateDivisionObject(index, name, value);
  };

  onSaveClick = async (onSaved: (ids: number[]) => void) => {
    let canSave = true;
    
    // Валидация всех объектов разделения
    this.divisionObjects.forEach((obj, index) => {
      const docNumberValid = this.validateDivisionObject(index, "doc_number", obj.doc_number);
      const addressValid = this.validateDivisionObject(index, "address", obj.address);
      canSave = canSave && docNumberValid && addressValid;
    });

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        
        // Отправляем все объекты для разделения
        const divisionData = this.divisionObjects.map(obj => ({
          doc_number: obj.doc_number,
          address: obj.address
        }));

        const response = await divideArchiveObject(this.id, divisionData, this.fileIds);

        if (response.status === 201 || response.status === 200) {
          onSaved(response.data); // предполагается, что API возвращает массив ID созданных объектов
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
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

  loadArchiveObject = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.doc_number = response.data.doc_number;
          this.address = response.data.address;
          this.customer = response.data.customer;
          this.latitude = response.data.latitude;
          this.longitude = response.data.longitude;
          this.description = response.data.description;
          this.date_setplan = dayjs(response.data.date_setplan);
          this.quantity_folder = response.data.quantity_folder;
          this.status_dutyplan_object_id = response.data.status_dutyplan_object_id;
          this.archirecture_process_id = response.data.archirecture_process_id;
          this.archirecture_process_status_code = response.data.archirecture_process_status_code;
          this.archirecture_process_status_id = response.data.archirecture_process_status_id;
          if (this.archirecture_process_id) {
            this.loadAppication(this.archirecture_process_id);
          }
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

  loadAppication = async (application_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Application = response.data;
        });
        this.loadCustomer(response.data.customer_id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomer = async (customer_id: number) => {
    try {
      const response = await getCustomer(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Customer = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  async doLoad(id: number) {
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadArchiveObject(id);
  }
}

export default new NewStore();