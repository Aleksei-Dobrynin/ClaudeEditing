import { makeAutoObservable, runInAction, toJS } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { createWorkDocumentType, updateWorkDocumentType } from "api/WorkDocumentType";
import { getWorkDocumentType } from "api/WorkDocumentType/useGetWorkDocumentType";

class NewStore {
  id = 0;
  name = "";
  description = "";
  code = "";
  metadata = [];
  type_id = 0;
  label = '';
  value: any = null;
  errorname = "";
  errordescription = "";
  errorcode = "";
  errormetadata = "";

  typesValue = [
    { id: 1, name: "Текст", code: "text" },
    { id: 2, name: "Логическое", code: "boolean" },
    { id: 3, name: "Дата и время", code: "datetime" },
    { id: 4, name: "Справочник", code: "lookup" },
    { id: 5, name: "Карта", code: "geometry" },
  ];

  lookupValues = []
  newLookupValue = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.description = "";
      this.code = "";
      this.metadata = [];
      this.errorname = "";
      this.errordescription = "";
      this.errorcode = "";
      this.errormetadata = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  handleChangeMetadata = (event) => {
    const { name, value } = event.target;
    (this as any)[name] = value;
    if (event.target.name === "type_id") {
      this.value = null;
    }
  };

  addLookupValue = () => {
    if (this.newLookupValue.trim() !== "") {
      const newId = this.lookupValues.length + 1;
      this.lookupValues.push({ id: newId, label: this.newLookupValue });
      this.newLookupValue = "";
    }
  };

  handleSave = () => {
    const newId = this.metadata.length + 1;
    const type = this.typesValue.find(t => t.id === Number(this.type_id)).code;
    let value = this.value;
    if (type == 'datetime')
    {
      value = this.value.format("DD.MM.YYYY HH:mm");
    }
    const newRecord = {
      id: newId,
      type: type,
      label: this.label,
      value: value,
      options: this.lookupValues
    };
    this.metadata.push(newRecord);
    this.label = '';
    this.value = null;
    this.lookupValues = [];
  };

  removeMetadataItem = (id) => {
    this.metadata = this.metadata.filter((item) => item.id !== id);
    this.label = '';
    this.value = null;
    this.lookupValues = [];
  };

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
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          description: this.description,
          code: this.code,
          metadata: JSON.stringify(toJS(this.metadata)),
        };

        const response = data.id === 0
          ? await createWorkDocumentType(data)
          : await updateWorkDocumentType(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
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

  loadWorkDocumentType = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkDocumentType(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.name;
          this.description = response.data.description;
          this.code = response.data.code;
          this.metadata = JSON.parse(response.data.metadata);
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
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadWorkDocumentType(id);
  }
}

export default new NewStore();
