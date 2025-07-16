import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveObject } from "api/ArchiveObject/useGetArchiveObject";
import { createArchiveObject } from "api/ArchiveObject/useCreateArchiveObject";
import { setDutyNumberToDuty, updateArchiveObject } from "api/ArchiveObject/useUpdateArchiveObject";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import dayjs from "dayjs";
import { changeApplicationStatus } from "api/Application/useCreateApplication";
import { getarchirecture_roads } from "api/archirecture_road";
import { getarchitecture_statuses } from "api/architecture_status";
import { changeApplicationProcessStatus } from "api/architecture_process";
import {
  getSearchDutyPlanObject,
  getSearchDutyPlanObjectsByNumber,
} from "api/ArchiveObject/useGetArchiveObjects";
import { getApplication } from "api/Application/useGetApplication";
import { getCustomer } from "api/Customer/useGetCustomer";
import { Application } from "constants/Application";
import { Customer } from "constants/Customer";
import { CustomersForArchiveObject } from "constants/CustomersForArchiveObject";
import {getByCustomersIdArchiveObject} from "api/CustomersForArchiveObject/CustomersForArchiveObject"


interface DivisionHistory {
  id: number;
  doc_number: string;
  address: string;
  created_at?: string;
}

interface ParentObject {
  id: number;
  doc_number: string;
  address: string;
}

interface DivisionObject {
  doc_number: string;
  address: string;
  errordoc_number: string;
  erroraddress: string;
}

interface DutyPlan {
  id: number;
  address: string;
  number: string;
  archive_folders?: string;
  point: [number, number];
}

class NewStore {
  id = 0;
  doc_number = "";
  address = "";
  gis_address = "";
  customer = "";

  // archive_object_customer: ArchiveObjectCustomer[] = [];
  customers_for_archive_object: CustomersForArchiveObject[] = [{
    id: -1,
    full_name: '',
    pin: '',
    address: '',
    is_organization: false,
    description: '',
    dp_outgoing_number: ''
  }];
  
  description = "";
  latitude = 0;
  mapDutyPlanObject: DutyPlan[] = [];
  point = [];
  dutyPlanObjectNumber = "";
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
  parent_id = 0;

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

  divideObjectOpenPanel = false;
  // Новые поля для истории разделения
  dividedObjects: DivisionHistory[] = []; // Объекты, на которые был разделен текущий
  parentObject: ParentObject | null = null; // Родительский объект

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => [this.dutyPlanObjectNumber],
      () => this.loadDutyPlanObjects(),
      { delay: 1000 }
    );
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.doc_number = "";
      this.address = "";
      this.customer = "";
      this.customers_for_archive_object = [];
      this.description = "";
      this.parent_id = 0;
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
      this.mapDutyPlanObject = [];
      this.mapLayers = [];
      this.dutyPlanObjectNumber = "";
      this.gis_address = "";
      this.Application = null;
      this.dividedObjects = [];
      this.parentObject = null;
    });
  }

  newСustomerClicked() {
    this.customers_for_archive_object = [...this.customers_for_archive_object, {
      id: (this.customers_for_archive_object.length + 1) * -1,
      full_name: '',
      pin: '',
      address: '',
      is_organization: false,
      description: '',
      dp_outgoing_number: ''
    }]
  }

  changeDivideObjectPopup = (flag: boolean) => {
    this.divideObjectOpenPanel = flag;
  }

  deleteCustomer(i: number) {
    this.customers_for_archive_object.splice(i, 1);
  }

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

  handleChangeCustomer(event, index: number) {
      this.customers_for_archive_object[index][event.target.name] = event.target.value;
      validate(event);
    }
  handlePointChange = (newPoint: any[]) => {
    this.point = newPoint;
  };

  handleAddressChange = (newAddress: string, newPoint: [number, number]) => {
    this.gis_address = newAddress;
    this.address = newAddress;
    if (newPoint != null) {
      this.point = newPoint;
      this.addLayer(this.gis_address, "ГИС", newPoint);
    }
  };

  addLayer(address: string, type: string, layer: [number, number]) {
    const exists = this.mapLayers.some(
      (item) => item.address === address && item.point[0] === layer[0] && item.point[1] === layer[1]
    );
    if (!exists) {
      this.mapLayers.push({ address, type: type, point: layer });
    }
  }
  
  // Удалена фильтрация по type="Point" согласно требованию
  addLayerOne(layer: any) {
    this.mapLayers.push(layer);
  }

  updateLayer(updatedLayer: any) {
    // Находим индекс слоя по id (если есть) или по координатам
    const index = this.mapLayers.findIndex(layer => {
      if (layer.id && updatedLayer.id && layer.id === updatedLayer.id) {
        return true;
      }
      // Если нет id, пробуем сопоставить по типу геометрии и приблизительным координатам
      try {
        if (layer.geometry?.type === updatedLayer.geometry?.type) {
          // Простая проверка для Point
          if (layer.geometry?.type === "Point" && 
              Math.abs(layer.geometry.coordinates[0] - updatedLayer.geometry.coordinates[0]) < 0.0001 &&
              Math.abs(layer.geometry.coordinates[1] - updatedLayer.geometry.coordinates[1]) < 0.0001) {
            return true;
          }
          // Для других типов можно добавить более сложную логику
        }
      } catch (e) {
        return false;
      }
      return false;
    });

    if (index !== -1) {
      // Обновляем найденный слой
      this.mapLayers[index] = updatedLayer;
    }
  }

  removeLayers(deletedLayers: any[]) {
    this.mapLayers = this.mapLayers.filter(
      (layer) => !deletedLayers.some((deleted) => deleted.id === layer.id)
    );
  }

  setMapLayers(layers: any[]) {
    runInAction(() => {
      this.mapLayers = layers;
    });
  }

  searchFromDarek = async (eni: string) => {
    if (!eni) return;
    try {
      MainStore.changeLoader(true);
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.geometry = JSON.parse(response.data.geometry);
        this.address = response.data.address;
        this.addLayer(this.address, "ЕНИ", this.geometry[0]);
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  getSearchListFromDarek = async (propcode: string) => {
    try {
      const response = await getSearchDarek(propcode);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.DarekSearchList = response.data;
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  // Удалена фильтрация по type="Point" согласно требованию
  getMapLayers = () => {
    return this.mapLayers;
  };

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "doc_number", value: this.doc_number } };
    canSave = validate(event) && canSave;
    event = { target: { name: "address", value: this.address } };
    canSave = validate(event) && canSave;
    
    // Больше не проверяем наличие точки, можно добавлять любой GeoJSON объект
    if (this.mapLayers.length === 0) {
      return MainStore.openErrorDialog("Нужно добавить хотя бы один объект на карту!");
    }

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          doc_number: this.doc_number,
          address: this.address,
          customer: this.customer,
          customers_for_archive_object: this.customers_for_archive_object,
          latitude: this.latitude,
          longitude: this.longitude,
          description: this.description,
          parent_id: this.parent_id,
          date_setplan: this.date_setplan,
          quantity_folder: this.quantity_folder,
          status_dutyplan_object_id: this.status_dutyplan_object_id,
          layer: JSON.stringify(toJS(this.mapLayers)),
        };

        const response =
          data.id === 0 ? await createArchiveObject(data) : await updateArchiveObject(data);

        if (response.status === 201 || response.status === 200) {
          onSaved(response);
          console.log(i18n.language);
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

  onClickDutyInMap(dutyPlan: DutyPlan) {
    MainStore.openErrorConfirm(
      `Вы хотите перекинуть документы объекта по адресу ${this.address} на номер ${dutyPlan.number}?`,
      "Да",
      "Нет",
      () => {
        this.setDutyNumberToObjects(dutyPlan);
      },
      () => MainStore.onCloseConfirm()
    );
  }

  loadDutyPlanObjects = async () => {
    if (
      !this.dutyPlanObjectNumber ||
      this.dutyPlanObjectNumber == "" ||
      this.dutyPlanObjectNumber.length < 2
    ) {
      this.mapDutyPlanObject = [];
      return;
    }
    try {
      MainStore.changeLoader(true);
      this.mapDutyPlanObject = [];
      const response = await getSearchDutyPlanObjectsByNumber(this.dutyPlanObjectNumber);
      if (Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach((item) => {
          const geoObj = JSON.parse(item.layer);
          if (geoObj && geoObj.length > 0) {
            const point: [number, number] = [
              geoObj[0].geometry.coordinates[1],
              geoObj[0].geometry.coordinates[0],
            ];
            this.mapDutyPlanObject.push({
              id: item.id,
              address: item.address,
              number: item.doc_number,
              archive_folders: item.archive_folders,
              point: point,
            });
          }
        });
      }
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // this.employeeInStructure = response.data;
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

  loadApplicationRoads = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchirecture_roads();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchitectureRoads = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  setDutyNumberToObjects = async (dutyPlan: DutyPlan) => {
    try {
      MainStore.changeLoader(true);
      const response = await setDutyNumberToDuty(this.id, dutyPlan.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.ArchitectureRoads = response.data;
        window.location.href = `/user/ArchiveObject/addedit?id=${dutyPlan.id}`
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
      MainStore.onCloseConfirm();
    }
  };

  loadArchitectureStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchitecture_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchitectureStatuses = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
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
          this.parent_id = response.data.parent_id;
          this.date_setplan = dayjs(response.data.date_setplan);
          this.quantity_folder = response.data.quantity_folder;
          this.status_dutyplan_object_id = response.data.status_dutyplan_object_id;
          this.archirecture_process_id = response.data.archirecture_process_id;
          this.archirecture_process_status_code = response.data.archirecture_process_status_code;
          this.archirecture_process_status_id = response.data.archirecture_process_status_id;
          
          this.dividedObjects = response.data.divided_objects || [];
          this.parentObject = response.data.parent_object || null;

          if (response.data && response.data.layer) {
            const parsedLayers = JSON.parse(response.data.layer);
            this.setMapLayers(parsedLayers);
          }
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
  
  // Загрузка истории разделения объекта
  loadDivisionHistory = async (objectId: number) => {
    try {
      // Загружаем объекты, на которые был разделен текущий
      const dividedResponse = await fetch(`/api/ArchiveObject/GetDividedObjects/${objectId}`);
      if (dividedResponse.ok) {
        const dividedData = await dividedResponse.json();
        runInAction(() => {
          this.dividedObjects = dividedData;
        });
      }

      // Загружаем родительский объект
      const parentResponse = await fetch(`/api/ArchiveObject/GetParentObject/${objectId}`);
      if (parentResponse.ok) {
        const parentData = await parentResponse.json();
        runInAction(() => {
          this.parentObject = parentData;
        });
      }
    } catch (err) {
      console.error("Ошибка загрузки истории разделения:", err);
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

  loadCustomers_for_archive_object = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getByCustomersIdArchiveObject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(async () => {
          if (response.data.length > 0) {
            this.customers_for_archive_object = response.data
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

 
  async doLoad(id: number) {
    this.loadApplicationRoads();
    this.loadArchitectureStatuses();
    if (id == null || id == 0) {
      this.customers_for_archive_object = [{
        id: (this.customers_for_archive_object.length + 1) * -1,
        full_name: '',
        pin: '',
        address: '',
        is_organization: false,
        description: '',
        dp_outgoing_number: ''
      }]
      return;
    }
    await this.loadCustomers_for_archive_object(id);
    this.id = id;
    this.loadArchiveObject(id);
  }
}

export default new NewStore();