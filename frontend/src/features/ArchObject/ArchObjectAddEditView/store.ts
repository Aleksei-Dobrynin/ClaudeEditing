import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getArchObject } from "api/ArchObject/useGetArchObject";
import { createArchObject } from "api/ArchObject/useCreateArchObject";
import { updateArchObject } from "api/ArchObject/useUpdateArchObject";
import { getDistricts } from "../../../api/District/useGetDistricts";
import { getTags } from "api/Tag/useGetTags";
import { getObjectTagsByIdObject } from "api/arch_object_tag";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import  ApplicationAddEditViewStore  from "../../Application/ApplicationAddEditView/store";


class NewStore {
  id = 0;
  address = '';
  name = '';
  identifier = '';
  district_id = 0;
  xcoordinate = 0;
  ycoordinate = 0;
  description = '';
  geometry = [];
  point = [];
  addressInfo = [];
  erroraddress = '';
  errorname = '';
  erroridentifier = '';
  errordistrict_id = '';
  errordescription = '';
  Districts = []
  Tags = []
  DarekSearchList = [];
  darek_eni = '';
  id_tags:  number[]



  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.address = '';
      this.name = '';
      this.identifier = '';
      this.xcoordinate = 0;
      this.district_id = 0;
      this.ycoordinate = 0;
      this.description = '';
      this.erroraddress = '';
      this.errorname = '';
      this.erroridentifier = '';
      this.errordistrict_id = '';
      this.errordescription = '';
      this.Districts = [];
      this.Tags = [];
      this.id_tags = [];
      this.point = [];
      this.darek_eni = '';
      this.DarekSearchList = [];
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  setCoords(x: number, y: number) {
    this.xcoordinate = x
    this.ycoordinate = y
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          address: this.address,
          name: this.name,
          identifier: this.identifier,
          xcoordinate: this.xcoordinate,
          district_id: this.district_id,
          ycoordinate: this.ycoordinate,
          description: this.description,
          tags: this.id_tags,
          name_kg: ""
        };

        const response = data.id === 0
          ? await createArchObject(data)
          : await updateArchObject(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            this.id = response.data.id;
            ApplicationAddEditViewStore.setArchObjectId(response.data.id);
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

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Districts = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchFromDarek = async (eni: string) => {
    try {
      MainStore.changeLoader(true);
      if(eni.length > 15) {
        eni = eni.substring(0, 15)
      } else {
        return
      }
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        this.geometry = JSON.parse(response.data.geometry);
        this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        this.address = '';
        this.identifier = '';
        this.geometry = [];
        this.addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      } else  {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  getSearchListFromDarek = async (propcode: string) => {
    try {
      // var propcode = "1-02-03-0006-0003-01"
      const response = await getSearchDarek(propcode);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.DarekSearchList = response.data;
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
      } else  {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  loadArchObject = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.address = response.data.address;
          this.name = response.data.name;
          this.identifier = response.data.identifier;
          this.district_id = response.data.district_id;
          this.xcoordinate = response.data.xcoordinate;
          this.ycoordinate = response.data.ycoordinate;
          this.description = response.data.description;
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

  loadarch_object_tag = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getObjectTagsByIdObject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id_tags = response.data.map((tag) => (
            tag.id_tag
          ));
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

  changeTags(ids: number[]) {
    this.id_tags = ids;
  }


  async doLoad(id: number) {
    this.loadTags()
    this.loadDistricts()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadArchObject(id);
    this.loadarch_object_tag(id)
  }
}

export default new NewStore();
