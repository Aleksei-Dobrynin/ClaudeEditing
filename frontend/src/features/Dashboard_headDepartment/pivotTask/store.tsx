import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { getForTaskPivotHeadDashboard } from "api/Dashboard";


class NewStore {

  pivot_out_of_date = false
  pivot_date_start = dayjs().add(-1, 'month')
  pivot_date_end = dayjs()

  data = [];
  showData = true;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.data = []
    });
  }

  changeData(data){
    this.data = data
  }


  changeApplications(e) {
    runInAction(() => {
      const { name, value, checked } = e.target;
      if (checked != null){
        (this as any)[name] = checked;
      }
      else (this as any)[name] = value;

      this.showData = false;
    })
    this.loadApplications()
  }


  async doLoad() {
    this.loadApplications();
  }

  loadApplications = async () => {
    if (this.pivot_date_start?.isValid() && this.pivot_date_end?.isValid()) {
      try {
        MainStore.changeLoader(true);
        const response = await getForTaskPivotHeadDashboard(this.pivot_date_start, this.pivot_date_end?.add(1, 'day'), this.pivot_out_of_date);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            const res = response.data.map(x => {
              const month = this.getTranslateMonth(x?.month)
              const day = this.getTranslateDay(x?.day)
              return {
                "Сотрудник": x?.employee,
                "Статус": x?.status,
                "Основная": x?.is_main ? "Да" : "Нет",
                "Тип": x?.type,
                "Структура": x?.structure,
                "Год": x?.year,
                "Месяц": month,
                "День": day,
              }
            })
            this.showData = true;
            this.data = res;
          });
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      this.data = []
    }
  };


  getTranslateDay = (day: string) => {
    switch (day.trim()) {
      case "MONDAY":
        return "1.Понедельник";
      case "TUESDAY":
        return "2.Вторник";
      case "WEDNESDAY":
        return "3.Среда";
      case "THURSDAY":
        return "4.Четверг";
      case "FRIDAY":
        return "5.Пятница";
      case "SATURDAY":
        return "6.Суббота";
      case "SUNDAY":
        return "7.Воскресенье";
      default:
        return "Не указан";
    }
  }
  getTranslateMonth = (month: string) => {
    switch (month.trim()) {
      case "JANUARY":
        return "1.Январь";
      case "FEBRUARY":
        return "2.Февраль";
      case "MARCH":
        return "3.Март";
      case "APRIL":
        return "4.Апрель";
      case "MAY":
        return "5.Май";
      case "JUNE":
        return "6.Июнь";
      case "JULY":
        return "7.Июль";
      case "AUGUST":
        return "8.Август";
      case "SEPTEMBER":
        return "9.Сентябрь";
      case "OCTOBER":
        return "10.Октябрь";
      case "NOVEMBER":
        return "11.Ноябрь";
      case "DECEMBER":
        return "12.Декабрь";
      default:
        return "Не указан";
    }
  }


}

export default new NewStore();
