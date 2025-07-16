import { makeAutoObservable, runInAction, computed } from "mobx";
import i18n from "i18next";
import dayjs from "dayjs";
import MainStore from "MainStore";
import { validate, validateField } from "./valid";
import { getstep_dependency } from "api/step_dependency";
import { createstep_dependency } from "api/step_dependency";
import { updatestep_dependency } from "api/step_dependency";

// dictionaries
import { getpath_steps } from "api/path_step";
import { getservice_paths } from "api/service_path";
    

class NewStore {
  id = 0
  service_path_id = 0
  dependent_step_id = 0
  prerequisite_step_id = 0
  is_strict = false
  

  errors: { [key: string]: string } = {};

  // Справочники
  service_paths = []
  path_steps = []
  filtered_steps = [] // Отфильтрованные шаги для выбранного service_path
  


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0
      this.service_path_id = 0
      this.dependent_step_id = 0
      this.prerequisite_step_id = 0
      this.is_strict = false
      this.filtered_steps = []
      
      this.errors = {}
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    this.validateField(name, value);
  }

  handleServicePathChange = (event) => {
    const { name, value } = event.target;
    this.service_path_id = value;
    this.validateField(name, value);
    
    // Обновляем filtered_steps при изменении service_path_id
    if (value) {
      // Используем нестрогое сравнение для обхода проблемы с типами
      this.filtered_steps = this.path_steps.filter(step => step.path_id == value);
    } else {
      this.filtered_steps = this.path_steps; // Если не выбран путь - показываем все шаги
    }
    
    // При изменении service_path сбрасываем зависимые поля
    this.dependent_step_id = 0;
    this.prerequisite_step_id = 0;
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = ""; 
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    var data = {
      
      id: this.id - 0,
      service_path_id: this.service_path_id - 0,
      dependent_step_id: this.dependent_step_id - 0,
      prerequisite_step_id: this.prerequisite_step_id - 0,
      is_strict: this.is_strict,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createstep_dependency(data);
      } else {
        response = await updatestep_dependency(data);
      }
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
  };

  async doLoad(id: number) {

    //загрузка справочников
    await this.loadservice_paths();
    await this.loadpath_steps();
    
    if (id === null || id === 0) {
      return;
    }
    this.id = id;

    this.loadstep_dependency(id);
  }

  loadstep_dependency = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getstep_dependency(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          
          this.id = response.data.id;
          
          // Находим service_path_id через связанные шаги
          const depStep = this.path_steps.find(s => s.id == response.data.dependent_step_id);
          if (depStep && depStep.path_id) {
            this.service_path_id = depStep.path_id;
            // Обновляем filtered_steps - используем нестрогое сравнение
            this.filtered_steps = this.path_steps.filter(step => step.path_id == depStep.path_id);
          } else if (response.data.service_path_id) {
            this.service_path_id = response.data.service_path_id;
            // Обновляем filtered_steps - используем нестрогое сравнение
            this.filtered_steps = this.path_steps.filter(step => step.path_id == response.data.service_path_id);
          }
          
          this.dependent_step_id = response.data.dependent_step_id;
          this.prerequisite_step_id = response.data.prerequisite_step_id;
          this.is_strict = response.data.is_strict;
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

  loadservice_paths = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getservice_paths();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.service_paths = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  
  loadpath_steps = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getpath_steps();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.path_steps = response.data
        this.filtered_steps = response.data; // Изначально показываем все шаги
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