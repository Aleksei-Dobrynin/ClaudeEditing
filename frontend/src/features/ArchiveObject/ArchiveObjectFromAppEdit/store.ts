import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveObject, getArchiveObjectByAppId } from "api/ArchiveObject/useGetArchiveObject";
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
import { Application } from "constants/Application";
import { getCustomer } from "api/Customer/useGetCustomer";
import { Customer } from "constants/Customer";
import { getArchObjectsByAppId } from "api/ArchObject/useGetArchObjects";
import {CustomersForArchiveObject} from "constants/CustomersForArchiveObject";

interface MapLayer {
  address: string;
  type: string;
  point: [number, number];
}

interface DutyPlan {
  id: number;
  address: string;
  number: string;
  archive_folders?: string;
  point: [number, number];
}

class NewStore {
  app_id = 0;
  from = ""
  arch_obj_id = 0;
  doc_number = "";
  address = "";
  gis_address = "";
  customer = "";

  customers_for_archive_object: CustomersForArchiveObject[];
  counts: number[] = [];

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
  dp_outgoing_number = "";
  errordoc_number = "";
  erroraddress = "";
  errorcustomer = "";
  errordescription = "";
  errorlatitude = "";
  errorlongitude = "";
  errordp_outgoing_number = "";
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
      this.app_id = 0;
      this.arch_obj_id = 0;
      this.doc_number = "";
      this.address = "";
      this.customer = "";
      this.customers_for_archive_object = [];
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
    });
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

  handlePointChange = (newPoint: any[]) => {
    this.point = newPoint;
  };

  handleAddressChange = (newAddress: string, newPoint: [number, number]) => {
    this.gis_address = newAddress;
    if (newPoint) {
      // this.point = newPoint;
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
  addLayerOne(layer: any) {
    if(layer?.geometry?.type === "Point"){
      this.mapLayers = this.mapLayers.filter((x) => x?.geometry?.type !== "Point");
    }
    this.mapLayers.push(layer);
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
    if (eni?.length >= 13) {
      eni = eni.substring(0, 15)
    } else {
      return
    }
    try {
      MainStore.changeLoader(true);
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.geometry = JSON.parse(response.data.geometry);
        this.address = response.data.address;
        this.addLayer(this.address, "ЕНИ", this.geometry[0]);
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      }else if(response.status === 500){
        MainStore.setSnackbar(i18n.t("Адрес не найден"), "error");
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
        // this.DarekSearchList = response.data;
        this.DarekSearchList = response.data;
        if (response.data?.length === 1) {
          this.handleChange({ target: { value: [], name: "DarekSearchList" } })
          this.searchFromDarek(response.data[0]?.propcode ?? "");
        }
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  getMapLayers = () => {
    const point = this.mapLayers.find((x) => x?.geometry?.type === "Point");
    if (!point) {
      return false;
    }
    return [point];
  };

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "doc_number", value: this.doc_number },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "address", value: this.address } };
    canSave = validate(event) && canSave;
    const point = this.getMapLayers();
    if (!point) {
      return MainStore.openErrorDialog("Нужно поставить точку!");
    }

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.arch_obj_id,
          doc_number: this.doc_number,
          address: this.address,
          customer: this.customer,
          customers_for_archive_object: this.customers_for_archive_object,
          latitude: this.latitude,
          longitude: this.longitude,
          description: this.description,
          date_setplan: this.date_setplan,
          quantity_folder: this.quantity_folder,
          status_dutyplan_object_id: this.status_dutyplan_object_id,
          layer: JSON.stringify(toJS(point)),
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

    // this.skipItem = this.skipItem + this.getCountItems;
    // this.getMyAppications(false);
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
      const response = await setDutyNumberToDuty(this.arch_obj_id, dutyPlan.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.ArchitectureRoads = response.data;
        window.location.reload();
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

  loadArchiveObject = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveObjectByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.arch_obj_id = response.data.id;
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

  loadAppication = async (application_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Application = response.data;
          console.log(this.Application, "Application")
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

  async doLoad(app_id: number) {
    this.loadApplicationRoads();
    this.loadArchitectureStatuses();
    if (app_id == null || app_id == 0) {
      return;
    }
    this.app_id = app_id;
    this.loadArchiveObject(app_id);
  }
}

export default new NewStore();
