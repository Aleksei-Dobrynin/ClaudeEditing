import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import {
  getApplicationsWithCoords,
  getApplicationsWithCoordsByHeadStructurev2,
  getApplicationsWithCoordsv2
} from "api/Dashboard";
import { getServices } from "api/Service/useGetServices";
import { getTags } from "api/Tag/useGetTags";


class NewStore {

  map_date_start = null;
  map_date_end = null;
  map_service_ids = [];
  map_status_id = 0;
  tag_ids = [];

  headStructure = false;

  Services = [];
  Tags = [];
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
      this.headStructure = false;
    });
  }


  changeApplications(e) {
    const { name, value } = e.target;
    (this as any)[name] = value;
    this.loadApplications()
  }

  changeServices(ids: number[]) {
    this.map_service_ids = ids;
    this.loadApplications();
  }

  async doLoad() {
    this.loadServices();
    this.loadTags();
    this.loadApplications();
  }

  loadApplications = async () => {
    if (this.map_date_start?.isValid() && this.map_date_end?.isValid()) {
      const map_status_code = this.Statuses.find(x => x.id === this.map_status_id)?.code ?? ""
      try {
        MainStore.changeLoader(true);
        let response;
        if(this.headStructure){
          // запрос на моих заявок
          response = await getApplicationsWithCoordsByHeadStructurev2(this.map_date_start, this.map_date_end?.add(1, 'day'), this.map_service_ids, this.tag_ids, map_status_code);
        
        }else{
          response = await getApplicationsWithCoordsv2(this.map_date_start, this.map_date_end?.add(1, 'day'), this.map_service_ids, this.tag_ids, map_status_code);
        }
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
  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Services = response.data;
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
        this.Tags = response.data;
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
