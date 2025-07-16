import { makeAutoObservable, runInAction, toJS } from "mobx";
import { validate } from "./validObject";
import i18n from "i18next";
import MainStore from "MainStore";
import { getDistricts } from "../../../api/District/useGetDistricts";
import { getTags } from "api/Tag/useGetTags";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import { ArchObjectValues } from "constants/ArchObject";
import { getArchObjectsByAppId } from "api/ArchObject/useGetArchObjects";
import PopupApplicationStore from "../PopupAplicationListView/store";


class NewStore {
  app_id = 0;
  id = 0;
  xcoordinate = 0;
  ycoordinate = 0;
  description = '';
  geometry = [];
  point = [];
  Districts = []
  Tags = []
  tags = []
  arch_objects: ArchObjectValues[] = []
  counts: number[] = [];
  loading = [false];
  legalRecords=false;



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.xcoordinate = 0;
      this.ycoordinate = 0;
      this.description = '';
      this.Districts = [];
      this.Tags = [];
      this.tags = [];
      this.point = [];
      this.arch_objects = [];
      this.app_id = 0;
    });
  }

  handleChangeLoading(i) {
    runInAction(() => {
      this.loading[i] = !this.loading[i];
    })
  }

  handleChange(event, index: number) {
    this.arch_objects[index][event.target.name] = event.target.value;
    validate(event, index);
  }

  handleChangeField(event) {
    this[event.target.name] = event.target.value;
  }

  setCoords(x: number, y: number) {
    this.xcoordinate = x
    this.ycoordinate = y
  }

  setBadgeConst (index) {
    runInAction(async ()=> {
      this.counts[index] =  await PopupApplicationStore.loadApplications(this.arch_objects[index].address, ()=> this.handleChangeLoading(index))
  })
}
  onSaveClick = () => {
    let canSave = true;
    this.arch_objects.forEach((x, i) => {
      let event: { target: { name: string; value: any } } = { target: { name: "address", value: x.address } };
      canSave = validate(event, i) && canSave;
      event = { target: { name: "district_id", value: x.district_id } };
      canSave = validate(event, i) && canSave;
      x.tags = this.tags;
      x.description = this.description;

    })
    return { canSave, data: this.arch_objects };
  };

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        let districts = response.data
        this.Districts = districts
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchFromDarek = async (eni: string, index: number) => {
    try {
      MainStore.changeLoader(true);
      if (eni.length >= 13) {
        eni = eni.substring(0, 15)
      } else {
        return
      }
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        this.arch_objects[index].geometry = JSON.parse(response.data.geometry);
        if (this.arch_objects[index].geometry.length > 0) {
          this.arch_objects[index].xcoordinate = this.arch_objects[index].geometry[0][0];
          this.arch_objects[index].ycoordinate = this.arch_objects[index].geometry[0][1];
        }
        this.arch_objects[index].address = response.data.address;
        this.arch_objects[index].addressInfo = response.data.info;
        this.geometry = this.arch_objects[index].geometry
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        this.arch_objects[index].address = '';
        this.arch_objects[index].identifier = '';
        this.arch_objects[index].geometry = [];
        this.arch_objects[index].addressInfo = [];
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

  getSearchListFromDarek = async (propcode: string, index: number) => {
    try {
      // var propcode = "1-02-03-0006-0003-01"
      const response = await getSearchDarek(propcode);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.arch_objects[index].DarekSearchList = response.data;
        if (response.data?.length === 1) {
          this.handleChange({ target: { value: [], name: "DarekSearchList" } }, index)
          this.searchFromDarek(response.data[0]?.propcode ?? "", index);
        }
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        // this.address = '';
        // this.identifier = '';
        // this.geometry = [];
        // this.addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(async () => {
          this.arch_objects = response.data
          this.tags = response.data[0]?.tags
          this.description = response.data[0]?.description

          this.counts = await Promise.all(this.arch_objects.map(async (arch, i) =>
            await PopupApplicationStore.loadApplications(arch.address, ()=> this.handleChangeLoading(i))))
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

  changeTags(ids: number[]) {
    this.tags = ids;
  }

  deleteAddress(i: number) {
    this.arch_objects.splice(i, 1);
    this.counts.splice(i, 1);
  }


  newAddressClicked() {
    this.arch_objects = [...this.arch_objects, {
      id: (this.arch_objects.length + 1) * -1,
      address: "",
      name: "",
      identifier: "",
      district_id: this.Districts.find(item => item.code === 'not defined')?.id,
      xcoordinate: null,
      ycoordinate: null,
      description: "",
      name_kg: "",
      tags: [],
      geometry: [],
      addressInfo: [],
      point: [],
      DarekSearchList: [],
      errordistrict_id: "",
      errordescription: "",
      erroraddress: "",
    }]
  }

  async loadDictionaries() {
    this.loadTags()
    await this.loadDistricts()
  }

  async doLoad(app_id: number) {
   await this.loadDictionaries();
    if (app_id == null || app_id == 0) {
      this.arch_objects = [{
        id: (this.arch_objects.length + 1) * -1,
        address: "",
        name: "",
        identifier: "",
        district_id: this.Districts.find(item => item.code === 'not defined')?.id,
        xcoordinate: null,
        ycoordinate: null,
        description: "",
        name_kg: "",
        tags: [],
        geometry: [],
        addressInfo: [],
        point: [],
        DarekSearchList: [],
        errordistrict_id: "",
        errordescription: "",
        erroraddress: "",
      }]
      return;
    }
    this.app_id = app_id;
    this.loadArchObjects(app_id);
    // this.loadarch_object_tag(app_id)
  }
}

export default new NewStore();
