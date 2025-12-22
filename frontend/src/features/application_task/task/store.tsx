import { makeAutoObservable, computed, runInAction, toJS } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import { changeTaskStatus, getapplication_task, GetOtherTaskByTaskId, getapplication_tasksByapplication_id } from "api/application_task";

// dictionaries

import { gettask_statuses } from "api/task_status";
import { getorg_structures } from "api/org_structure";
import { getEmployeeInStructureGroup } from "api/EmployeeInStructure/useGetEmployeeInStructure";
import storeComments from "features/ApplicationComments/ApplicationCommentsListView/store";
import {
  addToFavorite,
  checkCalucationForApplication,
  deleteToFavorite,
  getApplication, getStatusFavorite
} from "api/Application/useGetApplication";
import { APPLICATION_STATUSES, ErrorResponseCode } from "constants/constant";
import { getMyApplications } from "api/Application/useGetApplications";
import { Application } from "constants/Application";
import { getCustomer } from "api/Customer/useGetCustomer";
import { Customer } from "constants/Customer";
import { getArchObjectsByAppId } from "api/ArchObject/useGetArchObjects";
import { ArchObjectValues } from "constants/ArchObject";
import { getTags } from "api/Tag/useGetTags";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getApplicationRoads } from "api/ApplicationRoad/useGetApplicationRoads";
import { changeApplicationStatus } from "api/Application/useCreateApplication";
import {
  createapplication_task_assignee,
  deleteapplication_task_assignee,
  getapplication_task_assigneesByapplication_task_id
} from "api/application_task_assignee";
import { addOrUpdateObjectTags } from "api/arch_object_tag";
import { updateArchObjectCoords } from "api/ArchObject/useUpdateArchObject";
import axios from "axios";
import { API_KEY_2GIS } from "constants/config";
import { getstructure_tagBystructure_idAndAppId, getstructure_tags, updateApplicationTags } from "api/structure_tag";
import { getobject_tags } from "api/object_tag";
import { getDistricts } from "api/District/useGetDistricts";
import { getunit_typesSquare } from "api/unit_type";
import { gettech_decisions } from "api/tech_decision";
import { getAppTaskFilters } from "api/QueryFilters";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import { getSearchDutyPlanObject } from "../../../api/ArchiveObject/useGetArchiveObjects";
import { downloadFile } from "api/File";
import PopupApplicationStore from "../../Application/PopupAplicationListView/store";
import { applicationResolvedStatuses } from "constants/constant"
import LayoutStore from "layouts/MainLayout/store";
import { sendToTechCouncil } from "../../../api/TechCouncil";
import { getCommentsByApplicationId } from "../../../api/ApplicationComments/useGetByApplicationCommentByAplicationId";


interface MapLayer {
  address: string;
  type: string;
  point: [number, number];
}

interface DutyPlan {
  address: string;
  number: string;
  archive_folders?: string;
  point: [number, number];
}

class NewStore {
  id = 0
  current_id = 0;
  created_at = null
  updated_at = null
  created_by = 0
  updated_by = 0
  structure_id = 0
  structure_idNavName = ""
  application_id = 0
  application_number = ""
  openCabinetReject = false
  isCheckList = false
  task_template_id = 0
  comment = ""
  name = ""
  is_required = false
  is_favorite = false
  order = 0
  status_id = 0
  type_id = 0
  progress = 0
  deadline = null;
  codeFilter = "";
  status_textcolor = ""
  openStatusHistoryPanel = false;
  structure_tag_id = 0;
  object_tag_id = 0;
  district_id = 0;
  unit_type_id = 0;
  object_square = 0;
  structure_tag_name = "";
  taskEdited = false;
  DarekSearchList = [];
  darek_eni = "";
  address = "";
  geometry = [];
  mapLayers: MapLayer[] = [];
  identifier = '';
  point = [];
  dutyPlanObjectNumber = '';
  mapDutyPlanObject: DutyPlan[] = [];
  radius = 0;
  errorstructure_tag_id = "";
  errorobject_tag_id = ""
  errordistrict_id = ""
  errorunit_type_id = ""
  errorobject_square = ""
  errordutyPlanObjectNumber = ""
  errortech_decision_id = ""
  is_main = false
  isOpenStructureTemplates = false
  isOpenTechCouncil = false
  isPaymentDialogOpen = false;
  applicationComments = [];

  changed = false
  searchField = ""
  orderBy = ""
  orderType = ""
  errors: { [key: string]: string } = {};

  Application: Application = {
    id: 0,
    registration_date: null,
    customer_id: 0,
    status_id: 0,
    status_code: "",
    workflow_id: 0,
    service_id: 0,
    deadline: null,
    arch_object_id: 0,
    updated_at: null,
    customer: null,
    archObjects: null,
    number: "",
    work_description: "",
    object_tag_id: 0,
  };
  Customer: Customer = {
    id: 0,
    pin: "",
    is_organization: false,
    full_name: "",
    address: "",
    director: "",
    okpo: "",
    organization_type_id: 0,
    payment_account: "",
    postal_code: "",
    ugns: "",
    bank: "",
    bik: "",
    registration_number: "",
    sms_1: "",
    sms_2: "",
    email_1: "",
    email_2: "",
    telegram_1: "",
    telegram_2: "",
    document_date_issue: null,
    document_serie: "ID AN ",
    identity_document_type_id: null,
    document_whom_issued: "МКК ",
    individual_surname: "",
    individual_name: "",
    individual_secondname: "",
    customerRepresentatives: [],
  };
  Tags = []
  ObjectTags = []
  Districts = []
  UnitTypes = []
  StructureTags = []
  OrgStructures = []
  tags = []
  tagsForEdit = []
  task_assignees = []
  task_assigneeIds = []
  Statuses = []
  arch_objects: ArchObjectValues[] = []
  counts: number[];
  appCountsCustomer: number;
  ApplicationRoads = []
  AppTaskFilters = [];
  object_description = ""
  object_address = ""
  object_xcoord_orig = 0;
  object_ycoord_orig = 0;
  object_xcoord = 0;
  object_ycoord = 0;
  openPanelMap = false;
  coordsEdited = false;
  coordsInEditing = false;
  newCoordAddres = "";
  addAssigneePanelTaskId = 0
  structure_employee_id = 0
  openPanelEditTask = false;
  openPanelMtmTags = false;
  skipItem = 0;
  getCountItems = 0;
  noMoreItems = false;
  openPanelProcess = false;
  backUrl = "";
  tab_id = 0;
  expandedStepId = 0;
  tech_decision_id = 0;
  idTechDocumentinputKey = Math.random().toString(36);
  TechFileName = "";
  errorTechFileName = ""
  File = null;
  is_done = false;
  hasCalculation = false;
  application_resolved = false;

  isAssigned = false;



  // Справочники
  workflow_task_templates = []
  task_statuses = []
  task_types = []
  employeeInStructure = []
  org_structures = []
  tech_decisions = []
  otherTasks = []
  tasks = []

  Applications = []



  constructor() {
    makeAutoObservable(this, {
      isDisabled: computed,
    });
  }

  get isDisabled(): boolean {
    return !(
      MainStore.isAdmin ||
      // MainStore.isHeadStructure ||
      this.task_assigneeIds.includes(LayoutStore.employee_id)
      // || !(this.application_resolved && MainStore.isAdmin == false)
    );

    // return true
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.tab_id = 0;
      this.created_at = ""
      this.updated_at = ""
      this.created_by = 0
      this.updated_by = 0
      this.structure_id = 0
      this.application_id = 0
      this.application_number = ''
      this.openCabinetReject = false
      this.task_template_id = 0
      this.comment = ""
      this.name = ""
      this.is_required = false
      this.is_favorite = false
      this.DarekSearchList = [];
      this.order = 0
      this.status_id = 0
      this.type_id = 0
      this.progress = 0
      this.changed = false;
      this.deadline = null
      this.codeFilter = "";
      this.openPanelMtmTags = false;
      this.skipItem = 0;
      this.getCountItems = 0;
      this.noMoreItems = false;
      this.errors = {};
      this.openPanelEditTask = false;
      this.openPanelMtmTags = false;
      this.openStatusHistoryPanel = false;
      this.object_address = ""
      this.coordsInEditing = false;
      this.newCoordAddres = "";
      this.coordsEdited = false;
      this.object_xcoord_orig = 0;
      this.object_ycoord_orig = 0;
      this.object_xcoord = 0;
      this.object_ycoord = 0;
      this.structure_tag_id = 0;
      this.tech_decision_id = 0;
      this.structure_tag_name = "";
      this.taskEdited = false;
      this.errorobject_tag_id = "";
      this.errorstructure_tag_id = "";
      this.openPanelProcess = false;
      this.mapLayers = [];
      this.mapDutyPlanObject = [];
      this.otherTasks = [];
      this.radius = 0;
      this.is_main = false;
      this.idTechDocumentinputKey = Math.random().toString(36);
      this.TechFileName = "";
      this.errorTechFileName = "";
      this.File = null;
      this.is_done = false;
      this.application_resolved = false;
      this.isOpenStructureTemplates = false;
      this.applicationComments = [];
    });
  }


  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.taskEdited = true;

  }



  changeObjectTag(object_tag_id: number) {
    if (object_tag_id == 0) {
      this.errorobject_tag_id = "Обязательное поле!"
    } else {
      this.errorobject_tag_id = ""
    }
    this.taskEdited = true;
    this.object_tag_id = object_tag_id
  }

  changeDistrict(district_id: number) {
    if (district_id == 0) {
      this.errordistrict_id = "Обязательное поле!"
    } else {
      this.errordistrict_id = ""
    }
    this.taskEdited = true;
    this.district_id = district_id
  }

  changeTechDecision(tech_decision_id: number) {
    if (tech_decision_id == 0) {
      this.errortech_decision_id = "Обязательное поле!"
    } else {
      this.errortech_decision_id = ""
    }

    if (tech_decision_id == this.tech_decisions.find(x => x.code == "approve").id) {
      this.errorTechFileName = ""
    }
    this.taskEdited = true;
    this.tech_decision_id = tech_decision_id
  }

  changeFile(file: any) {
    if (file == null) {
      this.errorTechFileName = "Обязательное поле!"
    } else {
      this.File = file
      this.TechFileName = file.name
    }
    this.taskEdited = true;
  }

  handleAddressChange = (newAddress: string, newPoint: [number, number]) => {
    this.address = newAddress;
    this.point = newPoint;
    if (newPoint) {
      this.addLayer(this.address, 'ГИС', newPoint)
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

  addLayer(address: string, type: string, layer: [number, number]) {
    const exists = this.mapLayers.some(
      (item) => item.address === address && item.point[0] === layer[0] && item.point[1] === layer[1]
    );
    if (!exists) {
      this.mapLayers.push({ address, type: type, point: layer });
    }
  }

  searchFromDarek = async (eni: string) => {
    try {
      MainStore.changeLoader(true);
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.geometry = JSON.parse(response.data.geometry);
        this.address = response.data.address;
        this.addLayer(this.address, 'ЕНИ', this.geometry[0])
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

  changeUnitType(unit_type_id: number) {
    if (unit_type_id == 0) {
      this.errorunit_type_id = "Обязательное поле!"
    } else {
      this.errorunit_type_id = ""
    }
    this.taskEdited = true;
    this.unit_type_id = unit_type_id
  }

  changeObjectSquare(object_square: number) {
    if (object_square == 0) {
      this.errorobject_square = "Обязательное поле!"
    } else {
      if (object_square < 0) {
        return;
      }
      this.errorobject_square = ""
    }
    this.taskEdited = true;
    this.object_square = object_square
  }

  changeStructureTag(structure_tag_id: number) {
    if (structure_tag_id == 0) {
      this.errorstructure_tag_id = "Обязательное поле!"
    } else {
      this.errorstructure_tag_id = ""
    }
    this.taskEdited = true;
    this.structure_tag_id = structure_tag_id
  }

  changeSearch(value: string) {
    this.searchField = value
  }

  changeEditCoord(flag: boolean) {
    this.coordsInEditing = flag;
  }

  changeApplicationHistoryPanel(bool: boolean) {
    runInAction(() => {
      this.openStatusHistoryPanel = bool;
    });
  }

  onAddAssigneeClick(taskId: number, structure_id: number) {
    this.loadEmployeeInStructure(structure_id)
    this.addAssigneePanelTaskId = taskId
    this.errors.structure_employee_id = ""
  }
  onAddAssigneeCancelClick() {
    this.addAssigneePanelTaskId = 0
    this.structure_employee_id = 0
  }
  async onAddAssigneeDoneClick() {
    if (this.structure_employee_id == 0) {
      this.errors.structure_employee_id = "Нужно кого-то выбрать!"
      return;
    }
    var data = {
      id: this.id - 0,
      structure_employee_id: this.structure_employee_id - 0,
      application_task_id: this.addAssigneePanelTaskId,
    };
    try {
      MainStore.changeLoader(true);
      let response = await createapplication_task_assignee(data);
      if (response.status === 201 || response.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        this.addAssigneePanelTaskId = 0
        this.structure_employee_id = 0
        this.errors.structure_employee_id = ""

        // Перезагружаем задачи
        await this.loadTasks()

        // Перезагружаем данные заявки для обновления статуса
        await this.loadAppication(this.application_id)

        // Обновляем список исполнителей
        await this.loadapplication_task_assignees()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }


  async saveTags() {
    try {
      MainStore.changeLoader(true);
      let response = await addOrUpdateObjectTags(this.tagsForEdit, this.application_id);
      if (response.status === 201 || response.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        this.tags = this.tagsForEdit;
        this.openPanelMtmTags = false;
        // this.loadArchObjects(this.application_id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async saveCoords() {

    MainStore.openErrorConfirm(
      i18n.t("Вы точно хотите поменять точку?"),
      i18n.t("yes"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          let response = await updateArchObjectCoords(this.application_id, this.object_xcoord, this.object_ycoord);
          if (response.status === 201 || response.status === 200) {
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
            runInAction(() => {
              this.openPanelMap = false;
              this.coordsEdited = false
              this.loadArchObjects(this.application_id);
              this.changeEditCoord(false)
              this.newCoordAddres = "";
            })
          } else {
            throw new Error();
          }
        } catch (err) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );

  };

  onEditTaskClicked(task_id: number) {
    this.openPanelEditTask = true
    this.current_id = task_id;
  }

  onEditTaskTags(flag: boolean) {
    this.openPanelMtmTags = flag
    this.tagsForEdit = this.tags
  }
  changeTags(ids: number[]) {
    this.tagsForEdit = ids;
  }

  onAddTaskClicked(flag: boolean) {
    this.openPanelEditTask = flag
    this.current_id = 0;
  }

  onCancelClickMap() {
    this.coordsEdited = false;
    this.openPanelMap = false;
    this.object_xcoord = this.object_xcoord_orig
    this.object_ycoord = this.object_ycoord_orig
    this.newCoordAddres = "";
    this.mapLayers = [];
    this.mapDutyPlanObject = [];
    this.radius = 0;
    this.darek_eni = "";
    this.address = "";
    this.dutyPlanObjectNumber = '';
    this.changeEditCoord(false)
  }

  onEditMap() {
    this.openPanelMap = true;
  }

  onProcessClick(flag: boolean) {
    this.openPanelProcess = flag
  }

  async setCoords(x: number, y: number) {
    this.coordsEdited = true;
    this.object_xcoord = x
    this.object_ycoord = y


    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items/geocode', {
        params: {
          // q: query,
          // point: x + "," + y,
          lat: x,
          lon: y,
          fields: "items.point,items.address_name",
          // radius: 10000,
          key: API_KEY_2GIS,
          // fields: 'items.point,items.address_name',
        },
      });

      const results = response.data.result.items || [];
      if (results?.length !== 0) {
        // this.newCoordAddres = results[0].name + (results[0]?.address_name ? ", " + results[0]?.address_name : "")
        this.newCoordAddres = results[0].name
        this.address = results[0].name;
        this.radius = 400;
        this.loadDutyPlanObjects();
      }
    } catch (error) {
      // console.error('Ошибка поиска:', error);
    }
  }
  loadAllComments = async (id) => {
    try {
      console.log('Loading comments for application_id:', id); // Для отладки
      MainStore.changeLoader(true);
      const response = await getCommentsByApplicationId(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        console.log('Comments loaded:', response.data); // Для отладки
        runInAction(() => {
          this.applicationComments = response.data;
        });
      } else {
        console.log('No comments found or error response'); // Для отладки
        runInAction(() => {
          this.applicationComments = [];
        });
      }
    } catch (err) {
      console.error('Error loading comments:', err); // Для отладки
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      runInAction(() => {
        this.applicationComments = [];
      });
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(id: number) {
    this.getMyAppications(true);

    //загрузка справочников
    this.loadAppTaskFilters();
    this.loadtask_statuses();
    this.loadTags();
    this.loadObjectTags()
    this.loadDistricts();
    this.loadUnitTypes();
    this.loadStructureTags();
    this.loadOrgStructures();
    this.loadApplicationRoads();
    this.loadStatuses();
    this.loadTechDesisions();
    this.loadArchObjects(this.application_id);

    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadTaskInformation(id)
  }

  changeDeadline(date: Dayjs) {
    if (date) {
      this.deadline = date.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      this.deadline = null
    }
  }

  async changeStatus(status_id: number) {
    try {
      let status = this.Statuses.find(x => x.id === status_id);

      if (status.code == APPLICATION_STATUSES.rejected_cabinet) {
        this.openCabinetReject = true;
        return;
      }


      MainStore.changeLoader(true);
      const response = await changeTaskStatus(this.id, status_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status_id

        // Перезагружаем задачи
        await this.loadTasks()

        // Перезагружаем данные заявки для обновления статуса
        await this.loadAppication(this.application_id)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadapplication_task = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_task(this.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {

          this.id = response.data.id;
          this.created_at = response.data.created_at;
          this.updated_at = response.data.updated_at;
          this.created_by = response.data.created_by;
          this.updated_by = response.data.updated_by;
          this.structure_id = response.data.structure_id;
          this.structure_idNavName = response.data.structure_idNavName
          this.status_textcolor = response.data.status_textcolor;
          this.application_id = response.data.application_id;
          this.application_number = response.data.application_number;
          this.task_template_id = response.data.task_template_id;
          this.comment = response.data.comment;
          this.name = response.data.name;
          this.is_required = response.data.is_required;
          this.is_favorite = response.data.is_favorite;
          this.order = response.data.order;
          this.status_id = response.data.status_id;
          this.type_id = response.data.type_id;
          this.progress = response.data.progress;
          this.deadline = response.data.task_deadline;
          this.object_square = response.data.application_square_value ?? 0;
          if (response.data.application_square_unit_type_id) {
            this.unit_type_id = response.data.application_square_unit_type_id;
          } else {
            this.unit_type_id = this.UnitTypes[0]?.id ?? 0
          }
          if (response.data.is_main != null) {
            this.is_main = response.data.is_main
          }

        });
        this.loadAppication(response.data.application_id)
        this.loadTasks()
        this.checkCalculations()
        this.loadArchObjects(response.data.application_id)
        this.loadStructure_tag_application()
        storeComments.setApplicationId(response.data.application_id)

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  loadtask_statuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await gettask_statuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.task_statuses = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Tags = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadStructureTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_tags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.StructureTags = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadOrgStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.OrgStructures = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadObjectTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getobject_tags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.ObjectTags = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          let districts = response.data
          this.Districts = districts
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async loadTasks() {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_tasksByapplication_id(this.application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const res = response.data.sort((a, b) => {
          if (a.structure_id === this.structure_id && b.structure_id !== this.structure_id) {
            return -1; // Если `a.str_id` равно 3, перемещаем его вверх
          }
          if (b.structure_id === this.structure_id && a.structure_id !== this.structure_id) {
            return 1; // Если `b.str_id` равно 3, перемещаем его вверх
          }
          return a.id - b.id; // Сортируем по возрастанию `str_id` для остальных
        });
        this.tasks = res;
        this.is_done = response.data?.filter(x => x.status_code !== "done")?.length === 0
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadUnitTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getunit_typesSquare();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.UnitTypes = response.data
        if (this.unit_type_id == null || this.unit_type_id == 0) {
          this.unit_type_id = response.data[0]?.id ?? 0
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadTechDesisions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await gettech_decisions();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.tech_decisions = response.data
        if (this.unit_type_id == null || this.unit_type_id == 0) {
          this.unit_type_id = response.data[0]?.id ?? 0
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadAppication = async (application_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Application.registration_date = response.data.registration_date;
          this.Application.updated_at = response.data.updated_at;
          this.Application.customer_id = response.data.customer_id;
          this.Application.status_id = response.data.status_id;
          this.Application.workflow_id = response.data.workflow_id;
          this.Application.service_id = response.data.service_id;
          this.Application.deadline = response.data.deadline;
          this.Application.status_code = response.data.status_code
          this.Application.arch_object_id = response.data.arch_object_id;
          this.Application.arch_process_id = response.data.arch_process_id;
          this.Application.status_code = response.data.status_code;
          this.application_resolved = applicationResolvedStatuses.includes(response.data.status_code)
          this.Application.number = response.data.number;
          this.Application.work_description = response.data?.work_description;
          this.Application.service_name = response.data?.service_name;
          this.Application.status_name = response.data?.status_name
          this.Application.object_tag_id = response.data?.object_tag_id
          this.object_tag_id = response.data?.object_tag_id ? response.data?.object_tag_id : 0
          this.tech_decision_id = response.data.tech_decision_id;
          this.is_favorite = response.data.is_favorite;
        })
        this.loadCustomer(response.data.customer_id)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.arch_objects = response.data
          this.tags = response.data[0]?.tags
          this.object_description = response.data[0]?.description
          this.district_id = response.data[0]?.district_id
          var obj_with_coords = response.data.filter(x => x.xcoordinate !== null && x.ycoordinate !== null)
          if (obj_with_coords?.length !== 0) {
            this.object_address = obj_with_coords[0].address
            this.object_xcoord = obj_with_coords[0].xcoordinate;
            this.object_ycoord = obj_with_coords[0].ycoordinate;
            this.object_xcoord_orig = obj_with_coords[0].xcoordinate;
            this.object_ycoord_orig = obj_with_coords[0].ycoordinate;
          }
        });
        this.counts = await Promise.all(response?.data?.map(async (x) => await PopupApplicationStore.loadApplications(x.address)));
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStructure_tag_application = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getstructure_tagBystructure_idAndAppId(this.structure_id, this.application_id);
      if (response.status === 201 || response.status === 200) {
        runInAction(() => {
          this.structure_tag_id = response.data.structure_tag_id;
          this.structure_tag_name = response.data.name;
        });
      } else if (response.status === 204) {
        this.structure_tag_id = 0;
        this.structure_tag_name = "";
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  saveApplicationTags = async () => {
    if ((this.structure_tag_id == 0 || this.structure_tag_id == null)
      && this.StructureTags.filter(x => x.structure_id === this.structure_id)?.length !== 0) {
      this.errorstructure_tag_id = "Обязательное поле!"
      return
    }
    if (this.object_tag_id == 0 || this.object_tag_id == null) {
      this.errorobject_tag_id = "Обязательное поле!"
      return
    }
    if (this.district_id < 1 || this.district_id == null) {
      this.errordistrict_id = "Обязательное поле!"
      return
    }

    if (this.tech_decision_id < 1 || this.tech_decision_id == null) {
      this.errortech_decision_id = "Обязательное поле!"
      return
    }
    if ((this.TechFileName == null || this.TechFileName == "") && this.tech_decision_id != this.tech_decisions.find(x => x.code == "approve").id) {
      this.errorTechFileName = "Нужно загрузить файл заключения"
    }

    try {
      MainStore.changeLoader(true);
      const response = await updateApplicationTags(
        this.application_id, this.structure_id, this.structure_tag_id, this.object_tag_id,
        this.district_id, this.object_square, this.unit_type_id, this.tech_decision_id, this.File, this.TechFileName);
      if (response.status === 201 || response.status === 200) {
        runInAction(() => {
          this.taskEdited = false;
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Statuses = response.data.filter((x) => x.name);
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
      const response = await getApplicationRoads();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ApplicationRoads = response.data;
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

  loadAppTaskFilters = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getAppTaskFilters();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.AppTaskFilters = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async changeToStatus(id: number, status_code: string) {
    if (status_code === APPLICATION_STATUSES.document_sent) { // проверка тэгов
      if (this.object_tag_id == 0 || this.object_tag_id == null) {
        this.errorobject_tag_id = "Обязательное поле!"
      }
      if (this.district_id < 1 || this.district_id == null) {
        this.errordistrict_id = "Обязательное поле!"
      }
      if ((this.structure_tag_id == 0 || this.object_tag_id == null)
        && this.StructureTags.filter(x => x.structure_id === this.structure_id)?.length !== 0) {
        this.errorstructure_tag_id = "Обязательное поле!"
      }
      if (this.errorobject_tag_id !== "" || this.errorstructure_tag_id !== "" || this.errordistrict_id !== "") {
        MainStore.setSnackbar("Заполните поля правильно!", "error")
        return;
      }
      if (this.taskEdited) {
        this.saveApplicationTags();
      }
    }

    try {
      MainStore.changeLoader(true);
      const response = await changeApplicationStatus(this.application_id, id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.Application.status_id = id;
        this.Application.status_code = status_code;
        if (status_code === 'to_technical_council') {
          this.isOpenTechCouncil = true;
        }
        this.application_resolved = applicationResolvedStatuses.includes(status_code)
      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
        const message = JSON.parse(response?.response?.data?.errorMessage)
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
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

  loadTaskInformation = (id_task: number) => {
    this.id = id_task
    this.loadapplication_task()
    this.loadapplication_task_assignees()
  }

  async changeTaskStatus(status_id: number, task_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await changeTaskStatus(task_id, status_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status_id

        // Перезагружаем задачи
        await this.loadTasks()

        // Перезагружаем данные заявки для обновления статуса
        await this.loadAppication(this.application_id)

        // Проверяем калькуляции
        await this.checkCalculations()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async checkCalculations() {
    try {
      MainStore.changeLoader(true);
      const response = await checkCalucationForApplication(this.application_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.hasCalculation = response?.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  setMyPermissions() {
    this.isAssigned = this.task_assigneeIds.includes(LayoutStore.employee_id)
  }

  async loadapplication_task_assignees() {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_task_assigneesByapplication_task_id(this.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.task_assignees = response.data;
        this.task_assigneeIds = response.data.map(x => x.employee_id)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  deleteapplication_task_assignee(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteapplication_task_assignee(id);
          if (response.status === 201 || response.status === 200) {
            // Перезагружаем задачи
            await this.loadTasks();

            // Перезагружаем данные заявки для обновления статуса
            await this.loadAppication(this.application_id)

            // Обновляем список исполнителей
            await this.loadapplication_task_assignees()

            MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
          } else {
            throw new Error();
          }
        } catch (err) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
  }


  loadCustomer = async (customer_id: number) => {
    try {
      const response = await getCustomer(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.setCustomerData(response.data)
        this.appCountsCustomer = await PopupApplicationStore.loadApplications(response.data.pin)
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  changeDocInputKey() {
    this.idTechDocumentinputKey = Math.random().toString(36);
    if (this.TechFileName != null && this.TechFileName != "") {
      this.errorTechFileName = ""
    } else {
      this.errorTechFileName = "Обязательное поле!"
    }
  }

  setCustomerData = (data: Customer) => {
    this.Customer = {
      id: data.id,
      pin: data.pin,
      is_organization: data.is_organization,
      full_name: data.full_name,
      address: data.address,
      director: data.director,
      okpo: data.okpo,
      postal_code: data.postal_code,
      ugns: data.ugns,
      bank: data.bank,
      bik: data.bik,
      sms_1: data.sms_1,
      sms_2: data.sms_2,
      email_1: data.email_1,
      email_2: data.email_2,
      telegram_1: data.telegram_1,
      telegram_2: data.telegram_2,
      payment_account: data.payment_account,
      registration_number: data.registration_number,
      organization_type_id: data.organization_type_id,
      individual_name: data.individual_name,
      individual_secondname: data.individual_secondname,
      individual_surname: data.individual_surname,
      identity_document_type_id: data.identity_document_type_id,
      document_serie: data.document_serie,
      document_date_issue: data.document_date_issue,
      document_whom_issued: data.document_whom_issued,
      customerRepresentatives: data.customerRepresentatives,
    };
  };

  loadMoreApplicationsClicked = () => {
    this.skipItem = this.skipItem + this.getCountItems;
    this.getMyAppications(false)
  }

  loadDutyPlanObjects = async () => {
    try {
      MainStore.changeLoader(true);
      this.mapDutyPlanObject = [];
      const response = await getSearchDutyPlanObject(
        this.dutyPlanObjectNumber,
        this.object_xcoord,
        this.object_ycoord,
        this.radius
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach((item) => {
          const geoObj = JSON.parse(item.layer);
          const point: [number, number] = [geoObj[0].point[0], geoObj[0].point[1]];
          this.mapDutyPlanObject.push({
            address: item.address,
            number: item.doc_number,
            archive_folders: item.archive_folders,
            point: point
          })
        });
      }
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employeeInStructure = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }




    this.skipItem = this.skipItem + this.getCountItems;
    this.getMyAppications(false)
  }

  getMyAppications = async (restart: boolean) => {
    if (restart) {
      this.noMoreItems = false;
      this.skipItem = 0;
    }
    try {
      MainStore.changeLoader(true);
      const response = await getMyApplications(this.searchField, this.orderBy, this.orderType,
        this.skipItem, this.getCountItems, this.codeFilter);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        if (restart) {
          this.Applications = response.data
        } else {
          this.Applications = [...this.Applications, ...response.data]
        }
        if (response.data?.length < this.getCountItems) {
          this.noMoreItems = true
        }
        // this.Applications = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  loadEmployeeInStructure = async (structure_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructureGroup(structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employeeInStructure = response.data
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

  onOpenStructureTemplates() {
    this.isOpenStructureTemplates = true
  }

  onCloseStructureTemplates() {
    this.isOpenStructureTemplates = false;
  }

  async setFavorite() {
    try {
      MainStore.changeLoader(true);
      var set = this.is_favorite ? await deleteToFavorite(this.application_id) : await addToFavorite(this.application_id);
      const response = await getStatusFavorite(this.application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.is_favorite = response.data;
        });
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
