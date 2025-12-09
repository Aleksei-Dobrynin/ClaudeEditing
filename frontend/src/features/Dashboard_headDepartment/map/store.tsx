import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { getApplicationsWithCoords } from "api/Dashboard";
import { getServices } from "api/Service/useGetServices";


class NewStore {

  map_date_start = dayjs().add(-1, 'month')
  map_date_end = dayjs()
  map_service_id = 0;
  map_status_id = 1;

  // Services = [];
  Statuses = [
    {
      name: "Все заявки",
      code: "",
      id: 1,
    },
    {
      name: "В работе",
      code: "preparation",
      id: 2,
    },
    {
      name: "Реализовано",
      code: "done",
      id: 3,
    },
  ];
  data = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
    });
  }


  changeApplications(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadApplications()
  }


  async doLoad() {
    // this.loadServices();
    this.loadApplications();
  }

  loadApplications = async () => {
    if (this.map_date_start?.isValid() && this.map_date_end?.isValid()) {
      const map_status_code = this.Statuses.find(x => x.id === this.map_status_id)?.code ?? ""
      try {
        MainStore.changeLoader(true);
        const response = await getApplicationsWithCoords(this.map_date_start, this.map_date_end?.add(1, 'day'), this.map_service_id, 0, map_status_code);
        if ((response.status === 201 || response.status === 200) && response?.data !== null) {
          runInAction(() => {
            this.data = response.data;
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

  // loadServices = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getServices();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.Services = response.data;
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };


}

export default new NewStore();
