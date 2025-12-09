//import takeDataWithLanguage from './store';

//const words = takeDataWithLanguage('ru').staticWords;
import i18n from 'i18next';

export function isValidColor(strColor) {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}

export function CheckOnlyPositiveNumber(s, errors) {
  if (s < 0 || s == null || s == "") {
    errors.push(i18n.t("message:error.onlyPositiveNumbers"));
  }
}


export function CheckIdCountry(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseCountry"));
  }
}

export function CheckIdPerson(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.addPerson"));
  }
}

export function CheckIdDocumentType(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseDocumentType"));
  }
}

export function CheckIdFileType(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseFileType"));
  }
}

export function CheckIdTransactionType(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseTransactionType"));
  }
}

export function CheckIdPaymentReason(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.choosePaymentReason"));
  }
}


export function CheckIdPaymentType(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.choosePaymentType"));
  }
}


export function CheckIdValute(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseCurrency"));
  }
}

export function CheckIdPosition(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.choosePosition"));
  }
}

export function CheckIdCompanyType(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseCompanyType"));
  }
}

export function CheckIdSex(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseGender"));
  }
}

export function CheckRadioGroupId(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseValue"));
  }
}

export function CheckIdLanguage(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseLanguage"));
  }
}

export function CheckIdTypeContact(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseTypeContact"));
  }
}

export function CheckIdTypeCommunication(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseCommunicationType"));
  }
}

export function CheckIdTypeConsultation(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseConsultationType"));
  }
}

export function CheckIdImportantCommuncation(s, errors) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.chooseCommunicationImportance"));
  }
}


export function CheckEmptyTextField(s, errors) {
  if (s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
    return;
  }
  s = s.toString();
  s = s.replace(/\n/g, '')
  s = s.replace(/  */, '')
  if (s === 0) return;
  if (s == '' || s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
  }
}

export function CheckEmptyDigitField(s, errors) {
  if (s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
    return;
  }
  s = s.replace(/\n/g, '')
  s = s.replace(/  */, '')
  s = s.replace(/0*/g, '')
  if (s === 0) return;
  if (s === '' || s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
  }
}

export function CheckNewLine(s, errors) {
  var reg = /\n/;
  if (reg.test(s)) {
    errors.push(i18n.t("message:error.newLine"));
  }
}

export function CheckNullOrMore(s, errors, num) {
  if (s != undefined && s != '' && s.length < num) {
    errors.push(i18n.t("message:error.minLengthIs") + num);
  }
}

export function CheckEmptyFileField(s, errors) {
  if (s === null || s === "") {
    errors.push(i18n.t("message:error.fieldRequired"));
  }
}

export function CheckEmptyNumField(s, errors) {
  if (s == '' || s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
  }
}

export function CheckPaymentDate(date, errors) {
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateIssue"));
  }
}

export function CheckIdDocumentNavissueDate(date, errors) {
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateIssue"));
  }
}

export function CheckDateStart(date, errors) {
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateStart"));
  }
}

export function CheckDateStartAfterEnd(date, dateEnd, errors) {
  var g1 = new Date(dateEnd);
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateStartBeforeFinish"));
  }
}


export function CheckDateFinish(date, dateStart, errors) {
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  if (g1 > g2) {
    errors.push(i18n.t("message:error.dateFinish"));
  }
}

export function CheckDateNotLaterToday(date, errors) {
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateIssueToday"));
  }
}

export function CheckDateAfterToday(date, dateStart, errors) {
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  if (g1 > g2) {
    errors.push(i18n.t("message:error.dateTimeIssue"));
  }
}

export function CheckDateInRange(date, dateStart, dateFinish, errors) {
  if (date == null) return;
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  var g3 = new Date(dateFinish);
  if (g1 > g2) {
    errors.push(i18n.t("message:error.dateFinish"));
  }
  if (g3 < g2) {
    errors.push(i18n.t("message:error.dateStart"));
  }
}

export function CheckDateFinishNullable(date, dateStart, errors) {
  if (date == null || date == "") return;
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  if (g1 > g2) {
    errors.push(i18n.t("message:error.dateFinish"));
  }
}

export function CheckDateFinishEqualNullable(date, dateStart, errors, label = "message:error.dateFinishEqual") {
  if (date == null || date == "" ||date == "NaN-NaN-NaN") return;
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  if (g1 >= g2) {
    errors.push(i18n.t(label));
  }
}

export function CheckDatePeriod(date, dateStart, errors) {
  // need correct
  if (date == null || date == "") return;
  var g1 = new Date(dateStart);
  var g2 = new Date(date);
  if (g1 > g2) {
    errors.push(i18n.t("message:error.dateIssueStart"));
  }
}

export function CheckDateOneDay(date, dateStart, errors) {
  // Проверяет на 1 день
  if (date == null || date == "") return;
  var g2 = new Date(date);
  var g3 = new Date(dateStart)
  g3.setDate(g3.getDate() + 1)
  if(g3 < g2){
    errors.push(i18n.t("message:error.dateIssueStartOneDay"));
  }
}

export function CheckTimeFinishNullable(time, timeStart, errors) {
  if (time == null || time == '') return;
  if (timeStart == null || timeStart == '') return;
  var g1 = new Date();
  let [hours, minutes] = time.split(':');

  g1.setHours(+hours); // Set the hours, using implicit type coercion
  g1.setMinutes(minutes);
  g1.setSeconds(0);

  var g2 = new Date();
  let [hours2, minutes2] = timeStart.split(':');
  g2.setHours(+hours2); // Set the hours, using implicit type coercion
  g2.setMinutes(minutes2);
  g2.setSeconds(0);

  if (g1 <= g2) {
    errors.push(i18n.t("message:error.dateTimeIssue"));
  }
}


export function CheckDateIssue(date, errors) {
  if (date == null || date == '') return;
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 < g2) {
    errors.push(i18n.t("message:error.dateIssueToday"));
  }

}

export function CheckExpireDate(date, errors) {
  if (date == null || date == '') return;
  var g1 = new Date();
  var g2 = new Date(date);
  if (g1 >= g2) {
    errors.push(i18n.t("message:error.dateIssue"));
  }

}

export function CheckEmptyLookup(s, errors) {
  // if (s - 0 === 0) {
  if (+s === 0 || s == null) {
    errors.push(i18n.t("message:error.fieldRequired"));
  }
}

export function CheckEmptyMtmLookup(s, errors) {
  if(s.length == 0){
    errors.push(i18n.t("message:error.fieldRequired"));
  }
  // if (+s === 0 || s == null) {
  // }
}

export function CheckOnlyDigit(s, errors) {
  if (s === "") return;


  // let isnum = /^\d+$/.test(s);

  // У нас отрицательные числа больше не числа?!

  let isnum = /^-?[0-9]+?$/.test(s);

  if (!isnum) errors.push(i18n.t("message:error.onlyDigits"));
  // var reg = new RegExp('^\\d+$');
  // if (!reg.test(s)) {
  //   errors.push(i18n.t("message:error.onlyDigits"));
  // }
}


export function CheckIsNumber(s, errors) {
  if (s === "") return;


  let isnum = /^-?[0-9]+(?:\,[0-9]+)?$/.test(s);

  if (!isnum) errors.push(i18n.t("message:error.onlyDigits"));

}

export function CheckOnlyDecimal(s, errors) {
  if (s === "") return;
  let isnum = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(s);
  if (!isnum) errors.push(i18n.t("message:error.onlyDigits"));
  // var reg = new RegExp('^\\d+$');
  // if (!reg.test(s)) {
  //   errors.push(i18n.t("message:error.onlyDigits"));
  // }
}

export function CheckOnlyText(s, errors) {
  var reg = new RegExp('^\\D+$');
  if (s === "") return;
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.onlyText"));
  }
}

export function CheckIsEmail(s, errors) {
  if (s == null || s === "") return;
  var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.emailAddress"));
  }
}

export function CheckIsEqual(s, v, errors) {
  if (s - 0 === v) {
    errors.push(i18n.t("message:error.emailAddress") + ': ' + v);
  }
}

export function CheckLengthEqual(s, v, errors) {
  if (s == null || s.length != v) {
    errors.push(i18n.t("message:error.length") + ': ' + v);
  }
}

export function CheckIsEqualPass(s, v, errors) {
  if (s !== v) {
    errors.push(i18n.t("message:error.passwordMismatch"));
  }
}

export function CheckIsEqualPassForString(s, v, errors) {
  if (s !== v) {
    errors.push(i18n.t("message:error.fileNotMatch"));
  }
}

export function CheckIsEqualOrGreater(s, v, errors) {
  if (s - 0 >= v) {
    errors.push(i18n.t("message:error.notMore") + ': ' + v);
  }
}

export function CheckIsEqualOrLess(s, v, errors) {
  if (s - 0 <= v) {
    errors.push(i18n.t("message:error.notLess") + ': ' + v);
  }
}

export function CheckIsGreater(s, v, errors) {
  if (s - 0 > v) {
    errors.push(i18n.t("message:error.more") + ' ' + v);
  }
}

export function CheckIsLess(s, v, errors) {
  if (s - 0 < v) {
    errors.push(i18n.t("message:error.less") + ' ' + v);
  }
}

export function CheckMaxLength(s, v, errors) {
  if (s == null || s.length > v) {
    errors.push(i18n.t("message:error.maxLength") + ': ' + v);
  }
}

export function CheckMinLength(s, v, errors) {
  if (s == null || s.length < v) {
    errors.push(i18n.t("message:error.minLength") + ': ' + v);
  }
}
export function CheckDataCorectLength(s, errors) {
  if (s != null && s.length > 0) {
    if (s.length !== 10) {
      errors.push(i18n.t("message:error.minLength"));
    }
  }
}

export function CheckAgeMoreEqualThan(s, v, errors) {
  var from = s.split("-")
  var date = new Date(from[0], from[1] - 1, from[2])
  var ageDifMs = Date.now() - date.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  if (Math.abs(ageDate.getUTCFullYear() - 1970) < v) {
    errors.push(i18n.t("message:error.ageShouldBe") + ' ' + v + ' ' + i18n.t("message:error.yearsOld"));
  }
}

export function CheckLatitude(s, errors) {
  if (s == null || s === "") return;
  var reg = /^(\+|-)?(?:90(?:(?:\.0{1,100000})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,100000})?))$/

  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notLatitude"));
    return;
  }
  var str = s + '';
  if (str.includes('.')) {
    var split = str.split('.');
    if (split.length >= 1) {
      if (split[1].length > 6) {
        errors.push(i18n.t("message:error.only6digit"));
        return;
      }
    }
  }
}

export function CheckLongitude(s, errors) {
  if (s == null || s === "") return;
  var reg = /^(\+|-)?(?:180(?:(?:\.0{1,100000})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,100000})?))$/
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notLongitude"));
    return;
  }
  var str = s + '';
  if (str.includes('.')) {
    var split = str.split('.');
    if (split.length >= 1) {
      if (split[1].length > 6) {
        errors.push(i18n.t("message:error.only6digit"));
        return;
      }
    }
  }
}

export function CheckLowercase(s, errors) {
  if (s == null || s === "") return;
  var reg = /[a-z]/
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notOneLowercase"));
    return;
  }
}

export function CheckUppercase(s, errors) {
  if (s == null || s === "") return;
  var reg = /[A-Z]/
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notOneUppercase"));
    return;
  }
}

export function CheckDigit(s, errors) {
  if (s == null || s === "") return;
  var reg = /[\d]/
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notOneDigit"));
    return;
  }
}

export function CheckNonAlphanumeric(s, errors) {
  if (s == null || s === "") return;
  var reg = /[^a-zA-Z\d\s:]/
  if (!reg.test(s)) {
    errors.push(i18n.t("message:error.notOneNonAlphanumeric"));
    return;
  }
}

export function CheckEmptyArray(s, errors) {
  if (s.length > 0) return;
  if (s.length === 0) {
    errors.push(i18n.t("message:error.fieldRequired"));
    return;
  }
}
