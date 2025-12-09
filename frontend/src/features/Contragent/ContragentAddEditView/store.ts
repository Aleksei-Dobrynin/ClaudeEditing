import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getContragent, createContragent, updateContragent } from "api/Contragent";
import dayjs, { Dayjs } from 'dayjs';
import { getAllOrganizationData } from "api/SmejPortall"
import { SmejPortalOrganization } from "api/SmejPortall/models"

class NewStore {
  id = 0;
  organization_id = 0;
  name = "";
  address = "";
  contacts = "";
  user_id = "";
  date_start: Dayjs | null = null;
  date_end: Dayjs | null = null;
  code = "";
  Organisations: SmejPortalOrganization[] = [];
  
  errororganization_id = "";
  errorname = "";
  erroraddress = "";
  errorcontacts = "";
  errordate_start = "";
  errordate_end = "";
  errorcode = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.organization_id = 0;
      this.name = "";
      this.address = "";
      this.contacts = "";
      this.user_id = "";
      this.date_start = null;
      this.date_end = null;
      this.code = "";

      this.errororganization_id = "";
      this.errorname = "";
      this.erroraddress = "";
      this.errorcontacts = "";
      this.errordate_start = "";
      this.errordate_end = "";
      this.errorcode = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  handleDateChange(name: string, value: Dayjs | null) {
    this[name] = value;
    validate({ target: { name, value } });
  }

  handleOrganizationChange(event) {
    const orgId = event.target.value;
    this.organization_id = orgId;
    
    // Находим выбранную организацию и заполняем поля
    const selectedOrg = this.Organisations.find(org => org.id === orgId);
    if (selectedOrg) {
      runInAction(() => {
        this.name = selectedOrg.name || "";
        this.code = selectedOrg.organization_code || "";
        this.address = selectedOrg.address || "";
        this.contacts = selectedOrg.phone || "";
        this.user_id = selectedOrg.id.toString(); // Записываем id организации в user_id
      });
    } else {
      // Если организация не выбрана, очищаем поля
      runInAction(() => {
        this.name = "";
        this.code = "";
        this.address = "";
        this.contacts = "";
        this.user_id = "";
      });
    }
    
    validate(event);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };

    event = { target: { name: "organization_id", value: this.organization_id } };
    canSave = validate(event) && canSave;

    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;

    event = { target: { name: "address", value: this.address } };
    canSave = validate(event) && canSave;

    event = { target: { name: "contacts", value: this.contacts } };
    canSave = validate(event) && canSave;

    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    event = { target: { name: "date_start", value: this.date_start } };
    canSave = validate(event) && canSave;

    event = { target: { name: "date_end", value: this.date_end } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          organization_id: this.organization_id,
          name: this.name,
          address: this.address,
          contacts: this.contacts,
          user_id: this.user_id,
          date_start: this.date_start ? this.date_start.toISOString() : null,
          date_end: this.date_end ? this.date_end.toISOString() : null,
          code: this.code,
        };

        const response = this.id === 0
          ? await createContragent(data)
          : await updateContragent(data);

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

  loadContragent = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getContragent(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // Если user_id содержит id организации, используем его для organization_id
          const orgId = response.data.user_id ? parseInt(response.data.user_id) : (response.data.organization_id || 0);
          
          this.organization_id = orgId;
          this.name = response.data.name || "";
          this.address = response.data.address || "";
          this.contacts = response.data.contacts || "";
          this.user_id = response.data.user_id || "";
          this.date_start = response.data.date_start ? dayjs(response.data.date_start) : null;
          this.date_end = response.data.date_end ? dayjs(response.data.date_end) : null;
          this.code = response.data.code || "";
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

  loadOrganisations = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getAllOrganizationData();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Organisations = response.data;
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
    // Сначала загружаем список организаций
    await this.loadOrganisations();
    
    if (id != null && id != 0) {
      this.id = id;
      await this.loadContragent(id);
    }
  }
}

export default new NewStore();