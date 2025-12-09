import {
  CheckDateFinish,
  CheckEmptyArray,
  CheckEmptyLookup,
  CheckEmptyTextField
} from "../../../components/ValidationHelper";
import store from "./store";
import i18n from "i18next";

export const validate = (event: { target: { name: string; value: any } }) => {
  let activeDateStart = "";
  if (event.target.name === "activeDateStart") {
    let activeDateStartErrors = [];
    CheckEmptyTextField(event.target.value, activeDateStartErrors);
    activeDateStart = activeDateStartErrors.join(", ");
    store.erroractiveDateStart = activeDateStart;
  }

  let activeDateEnd = "";
  if (event.target.name === "activeDateEnd") {
    let activeDateEndErrors = [];
    if (event.target.value != null) {
      CheckDateFinish(event.target.value, store.activeDateStart ,activeDateEndErrors)
    }
    activeDateEnd = activeDateEndErrors.join(", ");
    store.erroractiveDateEnd = activeDateEnd;
  }

  let idSchedule = "";
  if (event.target.name === "idSchedule") {
    let idScheduleErrors = [];
    CheckEmptyTextField(event.target.value, idScheduleErrors);
    activeDateStart = idScheduleErrors.join(", ");
    store.erroridSchedule = idSchedule;
  }

  let dayStart = "";
  if (event.target.name === "dayStart") {
    let dayStartErrors = [];
    if( store.selectedSchedule === "once") {
      CheckEmptyLookup(event.target.value, dayStartErrors);
    }
    dayStart = dayStartErrors.join(", ");
    store.errordayStart = dayStart;
  }
  //
  // let code = "";
  // if (event.target.name === "code") {
  //   let codeErrors = [];
  //
  //   code = codeErrors.join(", ");
  //   store.errorcode = code;
  // }
  //
  let idRepeatType = "";
  if (event.target.name === "idRepeatType") {
    let idRepeatTypeErrors = [];
    if(store.selectedSchedule !== "once"  ){
      CheckEmptyLookup(event.target.value, idRepeatTypeErrors);
    }
    idRepeatType = idRepeatTypeErrors.join(", ");
    store.erroridRepeatType = idRepeatType;
  }


  let timeStart = '';
  if (event.target.name === 'timeStart') {
    let timeStartErrors = [];
    CheckEmptyTextField(event.target.value, timeStartErrors);
    timeStart = timeStartErrors.join(', ');
    store.errortimeStart = timeStart;
  }

  let weekDay = '';
  if (
    event.target.name === 'monday' ||
    event.target.name === 'tuesday' ||
    event.target.name === 'wednesday' ||
    event.target.name === 'thursday' ||
    event.target.name === 'friday' ||
    event.target.name === 'saturday' ||
    event.target.name === 'sunday'
  ) {
    let weekDayErrors = [];
    if (store.monday === false && store.tuesday === false && store.wednesday === false && store.thursday === false && store.friday === false && store.saturday === false && store.sunday === false) {
      weekDayErrors.push(i18n.t("message:error.fieldRequired"));
    }
    weekDay = weekDayErrors.join(', ');
    store.errorweekDay = weekDay;
  }

  //
  // let timeEnd = '';
  // if (event.target.name === 'timeEnd') {
  //   let timeEndErrors = [];
  //   CheckEmptyTextField(event.target.value, timeEndErrors);
  //   timeEnd = timeEndErrors.join(', ');
  //   store.errortimeEnd = timeEnd;
  // }
  //
  // let body = "";
  // if (event.target.name === "body") {
  //   let bodyErrors = [];
  //
  //   body = bodyErrors.join(", ");
  //   store.errorbody = body;
  // }

  // let neededContactTypes = '';
  // if (event.target.name === 'neededContactTypes') {
  //   let neededContactTypesErrors = [];

  //   neededContactTypes = neededContactTypesErrors.join(', ');
  //   store.errorneededContactTypes = neededContactTypes;
  // }
  //
  // const canSave = true  &&  dayStart === '' ;

  let idSubscribtionType = '';
  if (event.target.name === 'idSubscribtionType') {
    let idSubscribtionTypeErrors = [];
    CheckEmptyArray(event.target.value, idSubscribtionTypeErrors);
    idSubscribtionType = idSubscribtionTypeErrors.join(', ');
    store.erroridSubscribtionType = idSubscribtionType;
  }
  const canSave = true && idSubscribtionType === "" && activeDateStart === "" && activeDateEnd === "" && dayStart === "" && idRepeatType === "" && timeStart === "" && weekDay === "";
  return canSave;
};