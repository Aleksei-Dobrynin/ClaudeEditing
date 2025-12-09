import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getarchive_objects_event } from "api/ArchiveObjectEvents";
import { createarchive_objects_event } from "api/ArchiveObjectEvents";
import { updatearchive_objects_event } from "api/ArchiveObjectEvents";
import { getevent_types } from "api/EventType";
import { getApplications } from "api/Application/useGetApplications";
import { getEmployeeInStructureGroup } from "api/EmployeeInStructure/useGetEmployeeInStructure";
import { getorg_structures } from "api/org_structure";

class NewStore {
  id = 0
  description = ""
  employee_id = null
  head_structure_id = null
  event_type_id = null
  event_date = null
  structure_id = null
  application_id = null

  idArchiveObject: number | null = null

  errors: { [key: string]: string } = {};

  event_types = []
  structures = []
  applications = []
  employeeInStructure = []
  headStructures = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.description = ""
      this.employee_id = null
      this.head_structure_id = null
      this.event_type_id = null
      this.event_date = null
      this.structure_id = null
      this.application_id = null
      this.idArchiveObject = null
      this.errors = {}
      this.event_types = []
      this.structures = []
      this.applications = []
      this.employeeInStructure = []
      this.headStructures = []
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  handleDateChange(name: string, value: any) {
    // Если value это событие с target.value, извлекаем значение
    let dateValue = value?.target?.value || value;
    
    // Преобразуем dayjs объект или строку в формат для хранения
    if (dateValue && dayjs.isDayjs(dateValue)) {
      (this as any)[name] = dateValue.format('YYYY-MM-DD');
    } else if (dateValue && typeof dateValue === 'string') {
      // Если это строка ISO, преобразуем в нужный формат
      const parsedDate = dayjs(dateValue);
      if (parsedDate.isValid()) {
        (this as any)[name] = parsedDate.format('YYYY-MM-DD');
      } else {
        (this as any)[name] = null;
      }
    } else {
      (this as any)[name] = dateValue;
    }
    this.validateField(name, (this as any)[name]);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  setStructureID(id: number) {
    this.structure_id = id;
    this.loadEmployeeInStructure()
  }

  loadEmployeeInStructure = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeInStructureGroup(this.structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employeeInStructure = response.data
          this.headStructures = response.data?.filter(x => x.post_code === "head_structure") ?? []
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
    const archiveObjectId = this.idArchiveObject;

    var data = {
      id: this.id - 0,
      description: this.description,
      employee_id: this.employee_id - 0,
      head_structure_id: this.head_structure_id - 0,
      archive_object_id: archiveObjectId,
      event_type_id: this.event_type_id - 0,
      event_date: this.event_date || null,
      structure_id: this.structure_id - 0,
      application_id: this.application_id - 0,
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
        response = await createarchive_objects_event(data);
      } else {
        response = await updatearchive_objects_event(data);
      }
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id || response.data);
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

  loadorg_structures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.structures = response.data
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
    this.loadDictionaries();

    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    this.loadarchive_objects_event(id);
  }

  loadDictionaries = async () => {
    try {
      MainStore.changeLoader(true);

      await this.loadorg_structures()

      const eventTypesResponse = await getevent_types();
      if (eventTypesResponse.status === 200 && eventTypesResponse?.data !== null) {
        runInAction(() => {
          this.event_types = eventTypesResponse.data; 
          // .map((item: any) => ({
          //   value: item.id,
          //   label: item.name || `Event Type ${item.id}`
          // }));
        });
      }

      // const applicationsResponse = await getApplications();
      // if (applicationsResponse.status === 200 && applicationsResponse?.data !== null) {
      //   runInAction(() => {
      //     this.applications = applicationsResponse.data.map((item: any) => ({
      //       value: item.id,
      //       label: item.number || `Application ${item.id}`
      //     }));
      //   });
      // }
    } catch (err) {
      console.error("Error loading dictionaries:", err);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadarchive_objects_event = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getarchive_objects_event(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.description = response.data.description || "";
          this.employee_id = response.data.employee_id - 0 ;
          this.head_structure_id = response.data.head_structure_id - 0 ;
          this.event_type_id = response.data.event_type_id - 0;
          this.event_date = response.data.event_date || null;
          this.structure_id = response.data.structure_id - 0 ;
          this.application_id = response.data.application_id - 0;

          if (this.structure_id) {
            this.loadEmployeeInStructure();
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
}

export default new NewStore();