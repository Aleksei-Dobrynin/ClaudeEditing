import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getAllSignByUser, getSignEmployeeListByFile } from "api/SignDocuments";
import { validate } from "../../Application/ApplicationAddEditView/valid";
import dayjs from "dayjs";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  signers = [];
  dialogOpen = false;
  search = '';
  date_start = null;
  date_end = null;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  get filteredData() {
    if (!this.search && !this.date_start && !this.date_end) {
      return this.data;
    }
  
    return this.data.filter((item) => {
      // Поиск по нескольким полям
      const searchLower = this.search?.toLowerCase() || '';
      const matchSearch = !this.search || [
        item.file_type,
        item.structure_fullname,
        item.file_name,
        item.application_number
      ].some(field => 
        field?.toLowerCase().includes(searchLower)
      );
  
      // Фильтр по датам (включая граничные даты)
      const itemDate = item.timestamp ? dayjs(item.timestamp) : null;
      
      const matchDate = !itemDate || (
        (!this.date_start || !itemDate.isBefore(this.date_start.startOf('day'))) &&
        (!this.date_end || !itemDate.isAfter(this.date_end.endOf('day')))
      );
  
      return matchSearch && matchDate;
    });
  }

  loadSignDocumentss = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getAllSignByUser();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadSigners = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSignEmployeeListByFile(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.signers = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
    });
  };
}

export default new NewStore();
