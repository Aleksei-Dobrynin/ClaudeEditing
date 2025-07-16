import { makeAutoObservable, runInAction } from "mobx";
import {
  CustomSubscribtion,
  RepeatTypeNav,
  ScheduleNav,
  SubscriberTypeNav
} from "../../../constants/CustomSubscribtion";
import MainStore from "../../../MainStore";
import i18n from "i18next";
import { getScheduleTypeAll } from "../../../api/ScheduleType/useGetScheduleType";
import { getRepeatTypeAll } from "../../../api/RepeatType/UseGetRepeatType";
import dayjs, { Dayjs } from "dayjs";
import { validate } from "./valid";
import { createCustomSubscribtion } from "../../../api/CustomSubscribtions/UseCreateCustomSubscribtion";
import { updateCustomSubscribtion } from "../../../api/CustomSubscribtions/UseUpdateCustomSubscribtion";
import { getCustomSubscribtionOne } from "../../../api/CustomSubscribtions/useGetCustomSubscribtions";
import { ChangeEvent } from "react";
import { S_DocumentTemplate } from "../../../constants/S_DocumentTemplate";
import { getS_DocumentTemplates } from "../../../api/S_DocumentTemplate";
import { ContactType } from "../../../constants/ContactType";
import { getcontact_types } from "../../../api/contact_type";
import { getUserInfo } from "../../../api/Auth/useAuth";
import { ZIndexUtils } from "primereact/utils";
import { getEmployeeByIdUser } from "../../../api/Employee/useGetEmployeeByUserId";
import { getStructurePosts } from "../../../api/StructurePost/useGetStructurePosts";
import { number } from "yup";

class NewStore {
  currentRepeatTypeIsPeriod: boolean = false;
  id: number = 0;
  idSubscriberType: number | null = null;
  idSchedule: number | null = null;
  scheduleItem: ScheduleNav = {
    id: 0,
    name: "",
    code: "",
    description: "",
    repeatTypes: []
  };
  idRepeatType: number | null = null;
  sendEmpty: boolean = false;
  isActive: boolean = false;
  dayStart: Dayjs | null = null;
  timeStart: Dayjs | null = null;
  activeDateEnd: Dayjs | null = null;
  activeDateStart: Dayjs | null = null;
  timeEnd: Dayjs | null = null;
  monday: boolean = false;
  tuesday: boolean = false;
  wednesday: boolean = false;
  thursday: boolean = false;
  friday: boolean = false;
  saturday: boolean = false;
  sunday: boolean = false;
  dateOfMonth: number | null = null;
  weekOfMonth: number | null = null;
  body: string = "";
  title: string = "";
  selectedSchedule: string = "";
  idDocument: number | null = null;
  monthIsWeekDay: boolean = false;
  weekIsOfMonth: boolean = false;
  idSubscribtionType: number[] | null = [];
  idEmployee: number | null = null;
  idStructurePost: number | null = null;
  StructurePost: [];
  erroridStructurePost = "";

  weekDay: string = "";

  repeatTypeNav: RepeatTypeNav | null = {
    id: 0,
    name: "",
    code: "",
    isPeriod: false,
    repeatIntervalMinutes: 0
  };

  SubscriberTypeNav: SubscriberTypeNav = {
    id: 0,
    name: "",
    code: "",
    description: ""
  };



  //каждый справочник
  SubscriberTypes: [];
  RepeatTypes: RepeatTypeNav[] = [];
  ScheduleTypes: ScheduleNav[] = [];
  DocumentNav: S_DocumentTemplate[] = [];
  ContactTypes: ContactType[] = []

  //ошибки валидации
  erroridSubscriberType: "";
  erroridSchedule: string = "";
  erroridRepeatType: string = "";
  errorsendEmpty: "";
  errorisActive: "";
  errordayStart: string = "";
  errortimeStart: string = "";
  erroractiveDateEnd: string = "";
  erroractiveDateStart: string = "";
  errortimeEnd: string = "";
  errorcode: string = "";
  errormonday: "";
  errortuesday: "";
  errorwednesday: "";
  errorthursday: "";
  errorfriday: "";
  errorsaturday: "";
  errorsunday: "";
  errordateOfMonth: "";
  errorweekOfMonth: "";
  errorbody: string = "";
  erroridSubscribtionType: string = "";
  errorweekDay: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStoreAll() {
    runInAction(() => {
      this.activeDateStart = null;
      this.activeDateEnd = null;
      this.currentRepeatTypeIsPeriod = false;
      this.id = 0;
      this.idSubscriberType = null;
      this.idSchedule = null;
      this.body = ""
      this.idSubscribtionType = [];
      this.scheduleItem = {
        id: 0,
        name: "",
        code: "",
        description: "",
        repeatTypes: []
      };
      this.sendEmpty = false;
      this.weekDay = "";
      this.repeatTypeNav = {
        id: 0,
        name: "",
        code: "",
        isPeriod: false,
        repeatIntervalMinutes: 0
      };

      this.SubscriberTypeNav = {
        id: 0,
        name: "",
        code: "",
        description: ""
      };

      // каждый справочник
      this.SubscriberTypes = [];
      this.RepeatTypes = [];
      this.ScheduleTypes = [];

      // ошибки валидации
      this.erroridSubscriberType = "";
      this.erroridSchedule = "";
      this.erroridRepeatType = "";
      this.errorsendEmpty = "";
      this.errorisActive = "";
      this.errordayStart = "";
      this.errortimeStart = "";
      this.erroractiveDateEnd = "";
      this.erroractiveDateStart = "";
      this.errortimeEnd = "";
      this.errorcode = "";
      this.errormonday = "";
      this.errortuesday = "";
      this.errorwednesday = "";
      this.errorthursday = "";
      this.errorfriday = "";
      this.errorsaturday = "";
      this.errorsunday = "";
      this.errordateOfMonth = "";
      this.errorweekOfMonth = "";
      this.errorbody = "";
      this.idDocument = null
      this.clearStoreWhithChangeRadio();
      this.erroridSubscribtionType = "";
      this.errorweekDay = "";
    });
  }

  clearStoreWhithChangeRadio() {
    runInAction(() => {
      this.idRepeatType = null;
      this.isActive = false;
      this.dayStart = null;
      this.timeStart = null;
      this.timeEnd = null;
      this.dateOfMonth = null;
      this.weekOfMonth = null;
      this.title = "";
      this.selectedSchedule = "";
      this.monthIsWeekDay = false;
      this.weekIsOfMonth = false;
      this.clearStoreDayWeek();
    });
  };

  clearStoreDayWeek() {
    runInAction(() => {
      this.monday = false;
      this.tuesday = false;
      this.wednesday = false;
      this.thursday = false;
      this.friday = false;
      this.saturday = false;
      this.sunday = false;
    });
  }

  handleChange(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    this[event.target.name] = event.target.value;
    validate(event);
  }
  getValueIdSubscriptionContactType(id: number): boolean {
    var index = this.idSubscribtionType.indexOf(id);
    if (index === -1) {
      return false;
    }
    return true;
  }
  handleChangeIdSubscriptionContactType(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const idSubContactType = Number(event.target.name);
    const index: number = this.idSubscribtionType.indexOf(idSubContactType);
    if (index === -1) {
      this.idSubscribtionType.push(idSubContactType)
    } else {
      this.idSubscribtionType.splice(index, 1);
    }
    validate(event);
  }

  handleChangeWeek(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    this.clearStoreDayWeek();
    this[e.target.value] = true;
    this[e.target.name] = [e.target.value];
  }

  setMonthIsWeekDay() {
    runInAction(() => {
      this.monthIsWeekDay = true;
      this.weekIsOfMonth = false;
      this.weekOfMonth = 0;
      this.weekDay = "";
    });
  }

  setWeekIsOfMonth() {
    runInAction(() => {
      this.monthIsWeekDay = false;
      this.weekIsOfMonth = true;
      this.dateOfMonth = 0;
    });
  }

  setSchedule(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    let find = this.ScheduleTypes.find((item) => item.id === Number(e.target.value));
    runInAction(() => {
      if (find) {
        this.selectedSchedule = find.code;
        this.scheduleItem.id = find.id;
        this.scheduleItem.code = find.code;
        this.scheduleItem.description = find.description;
      }
    });
  }

  setCurrentRepeatTypeIsPeriod(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    if (Number(e.target.value) === 0) {
      this.idRepeatType = 0;
      return;
    }
    let find = this.RepeatTypes?.find(x => x.id === Number(e.target.value));
    if (find !== null) {
      this.currentRepeatTypeIsPeriod = find != null ? find.isPeriod : false;
      this.idRepeatType = find.id || 0;
    }
  }

  setCheckedDayOfTheMonth() {
    this.monthIsWeekDay = true;
  }

  setCheckedWeekOfMonth() {
    this.weekIsOfMonth = true;
  }

  loadScheduleTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getScheduleTypeAll();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ScheduleTypes = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadRepeatTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getRepeatTypeAll();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.RepeatTypes = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStructurePost = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructurePosts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.StructurePost = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomSubscribtionOne = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomSubscribtionOne(id);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const data: CustomSubscribtion = response.data;
        this.idSchedule = data.idSchedule;
        this.idRepeatType = data.idRepeatType;
        this.idSubscriberType = data.idSubscriberType;
        this.sendEmpty = data.sendEmpty;
        this.timeStart = data.timeStart ? dayjs(new Date(data.timeStart)) : null;
        this.timeEnd = data.timeEnd ? dayjs(new Date(data.timeEnd)) : null;
        this.monday = data.monday;
        this.tuesday = data.tuesday;
        this.wednesday = data.wednesday;
        this.thursday = data.thursday;
        this.friday = data.friday;
        this.saturday = data.saturday;
        this.sunday = data.sunday;
        this.sendEmpty = data.sendEmpty;
        this.dateOfMonth = data.dateOfMonth;
        this.weekOfMonth = data.weekOfMonth;
        this.isActive = data.isActive;
        this.activeDateStart = data.activeDateStart ? dayjs(new Date(data.activeDateStart)) : null;
        this.activeDateEnd = data.activeDateEnd ? dayjs(new Date(data.activeDateEnd)) : null;
        this.body = data.body;
        this.title = data.title;
        this.dayStart = data.timeStart ? dayjs(new Date(data.timeStart)) : null;
        this.scheduleItem = {
          id: data.idScheduleNav?.id,
          code: data.idScheduleNav?.code,
          description: data.idScheduleNav?.description,
          name: data.idScheduleNav?.name
        };
        this.repeatTypeNav = data.idRepeatTypeNav;
        this.SubscriberTypeNav = data.idSubscriberTypeNav;
        this.sendEmpty = data.sendEmpty;
        this.selectedSchedule = data.idScheduleNav.code;
        this.currentRepeatTypeIsPeriod = data.idRepeatTypeNav !== null ? data.idRepeatTypeNav.isPeriod : false;
        this.idSubscribtionType = data.idSubscribtionContactType ? data.idSubscribtionContactType.idTypeContact : [];
        this.monthIsWeekDay = data.monthIsWeekDay;
        this.idDocument = data.idDocument;
        this.weekIsOfMonth = data.monthIsWeekDay;
        this.idStructurePost = data.idStructurePost;


        this.weekDay = String(data.weekDay);


        if (this.dateOfMonth !== null && this.dateOfMonth !== 0) this.setCheckedDayOfTheMonth();
        if (this.weekOfMonth !== null && this.weekOfMonth !== 0) {
          this.setCheckedWeekOfMonth();
          const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

          days.forEach(day => {
            if (data[day]) {
              this.weekDay = day;
              this[day] = true;
            } else {
              this[day] = false;
            }
          });
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

  onSaveClick = async (onSaved: (id: number) => void) => {

    let canSave = true;

    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id }
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "activeDateStart", value: this.activeDateStart } };
    canSave = validate(event) && canSave;
    event = { target: { name: "activeDateEnd", value: this.activeDateEnd } };
    canSave = validate(event) && canSave;
    event = { target: { name: "idSchedule", value: this.idSchedule } };
    canSave = validate(event) && canSave;
    event = { target: { name: "timeStart", value: this.timeStart } };
    canSave = validate(event) && canSave;
    event = { target: { name: "timeEnd", value: this.timeEnd } };
    canSave = validate(event) && canSave;
    event = { target: { name: "dayStart", value: this.dayStart } };
    canSave = validate(event) && canSave;
    event = { target: { name: "body", value: this.body } };
    canSave = validate(event) && canSave;
    event = { target: { name: "idSubscribtionType", value: this.idSubscribtionType } };
    canSave = validate(event) && canSave;


    if (canSave) {
      try {
        MainStore.changeLoader(true);
        let data: CustomSubscribtion = {
          id: this.id,
          idSubscriberType: this.idSubscriberType,
          idSchedule: this.scheduleItem.id,
          idRepeatType: this.idRepeatType,
          sendEmpty: !!this.sendEmpty,
          timeStart:
            this.timeStart
              ? `${dayjs(this.dayStart ? new Date(this.dayStart.toDate()) : new Date("2000-01-01")).format("YYYY-MM-DD")}T${this.timeStart.format("HH:mm:ss")}`
              : null,
          timeEnd: this.timeEnd?.format("YYYY-MM-DDTHH:mm:ss"),
          monday: this.monday,
          tuesday: this.tuesday,
          wednesday: this.wednesday,
          thursday: this.thursday,
          friday: this.friday,
          saturday: this.saturday,
          sunday: this.sunday,
          dateOfMonth: Number(this.dateOfMonth),
          weekOfMonth: Number(this.weekOfMonth),
          isActive: this.isActive,
          activeDateEnd: this?.activeDateEnd ? this?.activeDateEnd.format("YYYY-MM-DDTHH:mm:ss") : undefined,
          activeDateStart: this.activeDateStart?.format("YYYY-MM-DDTHH:mm:ss"),
          body: this.body,
          title: this.title,
          idDocument: this.idDocument,
          idEmployee: this.idEmployee,
          idStructurePost: this.idStructurePost - 0,
          SubscribtionContactType: {
            idTypeContact: this.idSubscribtionType
          }
        };

        const response = data.id === 0
          ? await createCustomSubscribtion(data)
          : await updateCustomSubscribtion(data);

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

  loadDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.DocumentNav = response.data;
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

  loadContactType = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontact_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.ContactTypes = response.data;
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

  loadUser = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getUserInfo();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          MainStore.setCurrentEmployeeId(response.data.idEmployee);
          MainStore.setCurrentOrgStructureId(response.data.idOrgStructure);
        });
        await this.loadEmployee(response.data.id);

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadEmployee = async (id: string) => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeByIdUser(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.idEmployee = response.data.id;
          MainStore.setCurrentEmployeeId(response.data.idEmployee);
          MainStore.setCurrentOrgStructureId(response.data.idOrgStructure);
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
    this.id = id;
    await this.loadUser();
    await this.loadScheduleTypes();
    await this.loadRepeatTypes();
    await this.loadDocuments();
    await this.loadContactType();
    await this.loadStructurePost();

    if (id == null || id === 0) {
      return;
    } else {
      await this.loadCustomSubscribtionOne(id);
    }
  }
}

const storeInstance = new NewStore();
export default storeInstance;