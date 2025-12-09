import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchiveLog, getGroupByParentID } from "api/ArchiveLog/useGetArchiveLog";
import { createArchiveLog } from "api/ArchiveLog/useCreateArchiveLog";
import { updateArchiveLog } from "api/ArchiveLog/useUpdateArchiveLog";
import { getArchiveLogStatuss } from "../../../api/ArchiveLogStatus/useGetArchiveLogStatuss";
import { getorg_structures } from "../../../api/org_structure";
import {
  getEmployeeInStructureByService,
  getEmployeeInStructures
} from "../../../api/EmployeeInStructure/useGetEmployeeInStructures";
import { changeArchiveLogGroupStatus, changeArchiveLogStatus } from "../../../api/ArchiveLog/useGetArchiveLogs";
import { getEmployees } from "../../../api/Employee/useGetEmployees";
import { getarchive_folders } from "api/archive_folder";
import dayjs from "dayjs";
import { getArchObjects, getArchObjectsBySearch } from "../../../api/ArchObject/useGetArchObjects";
import { getArchiveObjects } from "../../../api/ArchiveObject/useGetArchiveObjects";
import { createArchiveObjectWithFolder } from "api/ArchiveObject/useCreateArchiveObject";

class NewStore {
  openAddFolder = false;
  popupDocNumber = "";
  popupAddress = "";

  id = 0;
  doc_number = "";
  address = "";
  status_id = 0;
  date_return = null;
  take_structure_id = 0;
  take_employee_id = 0;
  return_structure_id = 0;
  return_employee_id = 0;
  date_take = dayjs();
  deadline = dayjs().add(3, "week");
  name_take = '';
  ArchiveLogStatuses = [];
  org_structures = [];
  take_employees = [];
  return_employees = [];
  EmployeeInStructures = [];
  archiveObjects: { id: number | null; doc_number: string; address: string }[] = [];
  ArchiveObjects = [];
  ArchiveFolders = [];
  archive_folder_id = 0;
  archive_object_id = 0;
  isLoading = false;
  parent_id = 0;
  is_group_loaded = false;
  errordoc_number = "";
  erroraddress = "";
  errorstatus_id = "";
  errordate_return = "";
  errortake_structure_id = "";
  errortake_employee_id = "";
  errorreturn_structure_id = "";
  errorreturn_employee_id = "";
  errordate_take = '';
  errordeadline = '';
  errorname_take = '';
  errorarchive_object_id = '';


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.openAddFolder = false;
      this.popupAddress = "";
      this.popupDocNumber = "";

      this.id = 0;
      this.doc_number = "";
      this.address = "";
      this.status_id = 0;
      this.date_return = null;
      this.take_structure_id = 0;
      this.take_employee_id = 0;
      this.return_structure_id = 0;
      this.return_employee_id = 0;
      this.date_take = dayjs();
      this.deadline = dayjs().add(3, "week");
      this.name_take = '';
      this.parent_id = 0;
      this.is_group_loaded = false;
      this.archiveObjects = [];
      this.errordoc_number = "";
      this.erroraddress = "";
      this.errorstatus_id = "";
      this.errordate_return = "";
      this.errortake_structure_id = "";
      this.errortake_employee_id = "";
      this.errorreturn_structure_id = "";
      this.errorreturn_employee_id = "";
      this.errordate_take = '';
      this.errorname_take = '';
      this.errordeadline = '';
      this.archive_folder_id = 0;
    });
  }

  changeArchiveObject(value: any) {
    this.archive_object_id = value?.id;
    this.doc_number = value?.doc_number;
    this.address = value?.address;
  }

  changeObjectInput(value: string) {
    this.loadArchiveObjects(value);
    this.doc_number = value;
    // }
  }

  loadArchiveObjects = async (search?: string) => {
    try {
      this.isLoading = true;
      // const response = await getArchObjectsBySearch(search);
      const response = await getArchiveObjects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveObjects = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.isLoading = false;
    }
  };

  loadArchiveFolders = async () => {
    try {
      this.isLoading = true;
      // const response = await getArchObjectsBySearch(search);
      const response = await getarchive_folders();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveFolders = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.isLoading = false;
    }

  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    if (event.target.name === "take_employee_id") {
      this.take_structure_id = this.EmployeeInStructures.find(x => x.id == event.target.value)?.structure_id ?? 0;
      console.log(this.take_structure_id)
    }
    if (event.target.name === "return_employee_id") {
      this.return_structure_id = this.EmployeeInStructures.find(x => x.id == event.target.value)?.structure_id ?? 0;
    }

    if (event.target.name === "archive_folder_id") {
      this.address = this.ArchiveFolders.find(x => x.id == event.target.value)?.object_address ?? 0;
      this.doc_number = this.ArchiveFolders.find(x => x.id == event.target.value)?.archive_folder_name ?? 0;
    }

    validate(event);
  }

  changeStatus = async (new_status: number) => {
    try {
      MainStore.changeLoader(true);
      if (this.is_group_loaded) {
        const response = await changeArchiveLogGroupStatus(this.parent_id, new_status);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.loadArchiveLogParent(this.parent_id);
        } else {
          throw new Error();
        }
      } else {
        const response = await changeArchiveLogStatus(this.id, new_status);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          this.loadArchiveLog(response.data);
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

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLogStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchiveLogStatuses = response.data;
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
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  formatDateWithoutTimezone = (date) => {
    if (!date) return null;
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
    return dayjs(dayjsDate.format("YYYY-MM-DDTHH:mm:ss"));
  };

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id }
    };
    canSave = validate(event) && canSave;
    // event = { target: { name: "doc_number", value: this.doc_number } };
    // canSave = validate(event) && canSave;
    // event = { target: { name: "address", value: this.address } };
    // canSave = validate(event) && canSave;

    // if (this.doc_number != '' && this.doc_number?.includes("/")) {
    //   this.archiveObjects.push({ id: this.archive_object_id, doc_number: this.doc_number, address: this.address });
    //   this.archive_object_id = 0;
    //   this.doc_number = '';
    //   this.address = '';
    // } else {
    //   this.erroraddress = i18n.t("message:error.fieldRequired")
    // }

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          doc_number: this.doc_number,
          address: this.address,
          status_id: this.status_id,
          date_return: this.formatDateWithoutTimezone(this.date_return),
          take_structure_id: Number(this.take_structure_id) || null,
          take_employee_id: Number(this.EmployeeInStructures.find(x => x.id == this.take_employee_id)?.employee_id) || null,
          return_structure_id: Number(this.return_structure_id) || null,
          return_employee_id: Number(this.EmployeeInStructures.find(x => x.id == this.return_employee_id)?.employee_id) || null,
          date_take: this.formatDateWithoutTimezone(this.date_take),
          name_take: this.name_take,
          deadline: this.formatDateWithoutTimezone(this.deadline),
          // archiveObjects: this.archiveObjects,
          archive_folder_id: this.archive_folder_id
        };

        const response = data.id === 0
          ? await createArchiveLog(data)
          : await updateArchiveLog(data);

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
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  onSaveClickObject = async (onSaved: (id: number) => void) => {

    try {
      MainStore.changeLoader(true);

      var data = {
        id: 0,
        doc_number: this.popupDocNumber,
        address: this.popupAddress,
      };
      const response = await createArchiveObjectWithFolder(data as any)

      this.popupAddress = "";
      this.popupDocNumber = "";

      if (response.status === 201 || response.status === 200) {
        onSaved(response?.data);
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

  loadArchiveLog = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchiveLog(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.doc_number = response.data.doc_number;
          this.address = response.data.address;
          this.status_id = response.data.status_id;
          this.date_return = response.data.date_return;
          this.deadline = response.data.deadline;
          this.take_structure_id = response.data.take_structure_id;
          this.take_employee_id = this.EmployeeInStructures.find(x => x.employee_id == response.data.take_employee_id && x.structure_id == response.data.take_structure_id)?.id;
          this.return_structure_id = response.data.return_structure_id;
          this.return_employee_id = this.EmployeeInStructures.find(x => x.employee_id == response.data.return_employee_id && x.structure_id == response.data.return_structure_id)?.id;
          this.date_take = response.data.date_take;
          this.name_take = response.data.name_take;
          this.parent_id = response.data.parent_id;
          this.archive_folder_id = response.data.archive_folder_id
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

  loadArchiveLogParent = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getGroupByParentID(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.doc_number = response.data.doc_number;
          this.address = response.data.address;
          this.status_id = response.data.status_id;
          this.date_return = response.data.date_return;
          this.deadline = response.data.deadline;
          this.take_structure_id = response.data.take_structure_id;
          this.take_employee_id = this.EmployeeInStructures.find(x => x.employee_id == response.data.take_employee_id && x.structure_id == response.data.take_structure_id)?.id;
          this.return_structure_id = response.data.return_structure_id;
          this.return_employee_id = this.EmployeeInStructures.find(x => x.employee_id == response.data.return_employee_id && x.structure_id == response.data.return_structure_id)?.id;
          this.date_take = response.data.date_take;
          this.name_take = response.data.name_take;
          this.parent_id = response.data.parent_id;
          this.archive_folder_id = response.data.archive_folder_id
          // this.archiveObjects = response.data.archiveObjects;
        });
        this.is_group_loaded = true;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEmployees = async () => {
    try {
      const response = await getEmployeeInStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.return_employees = this.take_employees = response.data
        this.EmployeeInStructures = response.data;
        // .map(e => ({
        //     id: e.employee_id,
        //     employee_name: e.employee_name,
        //     post_name: e.post_name,
        //     structure_id: e.structure_id,
        //   }))
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  async doLoad(id: number, is_parent?: boolean) {
    await this.loadStatuses();
    await this.loadEmployees();
    this.loadArchiveObjects()
    this.loadArchiveFolders()
    this.loadorg_structures();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    if (is_parent) {
      this.loadArchiveLogParent(id)
    } else {
      this.loadArchiveLog(id);
    }
  }
}

export default new NewStore();
