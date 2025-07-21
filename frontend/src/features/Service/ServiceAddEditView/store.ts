import { makeAutoObservable, runInAction, computed } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getService } from "api/Service/useGetService";
import { createService } from "api/Service/useCreateService";
import { updateService } from "api/Service/useUpdateService";
import { getWorkflows } from "../../../api/Workflow/useGetWorkflows";
import dayjs from "dayjs";
import { getLawDocuments } from "../../../api/LawDocument";
import { getStructures } from "api/Structure/useGetStructures";

class NewStore {
  // Данные формы
  id = 0;
  name = "";
  short_name = "";
  code = "";
  description = "";
  day_count = 0;
  price = 0;
  workflow_id = null;
  law_document_id = null;
  structure_id = null;
  workflow_name = "";
  is_active = false;
  date_start = null;
  date_end = null;
  
  // Ошибки валидации
  errorname = "";
  errorshort_name = "";
  errorcode = "";
  errordescription = "";
  errorday_count = "";
  errorprice = "";
  errorworkflow_id = "";
  errorworkflow_name = "";
  errordate_start = "";
  errordate_end = "";
  errorlaw_document_id = "";
  errorstructure_id = "";
  
  // Справочники
  Workflows = [];
  LawDocuments = [];
  Structures = [];
  
  // UI состояния
  loading = false;
  error: string | null = null;
  saveSuccess = false;
  isDirty = false;

  constructor() {
    makeAutoObservable(this, {
      isValid: computed
    });
  }

  // Вычисляемое свойство для проверки валидности формы
  get isValid() {
    return !this.errorname && 
           !this.errorcode && 
           !this.errorday_count && 
           !this.errorprice &&
           !this.errorworkflow_id &&
           !this.errorstructure_id &&
           !this.errorlaw_document_id &&
           !this.errordate_start &&
           !this.errordate_end;
  }

  clearStore() {
    runInAction(() => {
      // Очистка данных формы
      this.id = 0;
      this.name = "";
      this.short_name = "";
      this.code = "";
      this.description = "";
      this.day_count = 0;
      this.price = 0;
      this.workflow_id = null;
      this.law_document_id = null;
      this.structure_id = null;
      this.workflow_name = "";
      this.is_active = false;
      this.date_start = null;
      this.date_end = null;
      
      // Очистка ошибок
      this.errorname = "";
      this.errorshort_name = "";
      this.errorcode = "";
      this.errordescription = "";
      this.errorday_count = "";
      this.errorprice = "";
      this.errorworkflow_id = "";
      this.errorworkflow_name = "";
      this.errordate_start = "";
      this.errordate_end = "";
      this.errorstructure_id = "";
      
      // Очистка справочников
      this.Workflows = [];
      this.LawDocuments = [];
      this.Structures = [];
      
      // Очистка UI состояний
      this.loading = false;
      this.error = null;
      this.saveSuccess = false;
      this.isDirty = false;
    });
  }

  handleChange(event) {
    runInAction(() => {
      let value = event.target.value;
      const fieldName = event.target.name;
      
      // Преобразование значений для числовых полей
      if (['workflow_id', 'law_document_id', 'structure_id'].includes(fieldName)) {
        if (value === '' || value === null || value === undefined) {
          value = null;
        } else {
          value = Number(value);
        }
      } else if (['day_count', 'price'].includes(fieldName)) {
        if (value === '' || value === null || value === undefined) {
          value = 0;
        } else {
          value = Number(value);
        }
      }
      
      this[fieldName] = value;
      this.isDirty = true;
      this.error = null;
      
      // Валидация с правильным значением
      validate({ target: { name: fieldName, value: value } });
    });
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    console.log('Начало сохранения...');
    let canSave = true;
    
    // Валидация всех полей
    const fieldsToValidate = [
      { name: "id", value: this.id },
      { name: "name", value: this.name },
      { name: "description", value: this.description },
      { name: "code", value: this.code },
      { name: "day_count", value: this.day_count },
      { name: "price", value: this.price }
    ];
    
    for (const field of fieldsToValidate) {
      const event = { target: field };
      canSave = validate(event) && canSave;
    }

    console.log('Результат валидации:', canSave);
    console.log('Ошибки:', {
      name: this.errorname,
      code: this.errorcode,
      day_count: this.errorday_count,
      price: this.errorprice
    });

    if (canSave) {
      try {
        runInAction(() => {
          this.loading = true;
          this.error = null;
          this.saveSuccess = false;
        });
        
        var data = {
          id: this.id,
          name: this.name,
          short_name: this.short_name,
          code: this.code,
          description: this.description,
          day_count: this.day_count,
          price: this.price,
          workflow_id: this.workflow_id || undefined,
          is_active: this.is_active,
          date_start: this.date_start ? this.date_start.format('YYYY-MM-DD') : null,
          date_end: this.date_end ? this.date_end.format('YYYY-MM-DD') : null,
          law_document_id: this.law_document_id || undefined,
          structure_id: this.structure_id || undefined
        };

        console.log('Данные для отправки:', data);

        const response = data.id === 0
          ? await createService(data)
          : await updateService(data);

        console.log('Ответ сервера:', response);

        if (response.status === 201 || response.status === 200) {
          runInAction(() => {
            this.saveSuccess = true;
            this.isDirty = false;
            if (data.id === 0) {
              this.id = response.data.id;
            }
          });
          
          onSaved(response.data.id || this.id);
          
          if (data.id === 0) {
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          } else {
            MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
          }
        } else {
          throw new Error("Неожиданный ответ сервера");
        }
      } catch (err) {
        console.error('Ошибка при сохранении:', err);
        runInAction(() => {
          this.error = i18n.t("message:somethingWentWrong");
        });
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        runInAction(() => {
          this.loading = false;
        });
      }
    } else {
      console.log('Валидация не пройдена');
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  loadWorkflows = async () => {
    try {
      const response = await getWorkflows();
      console.log('Workflows response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Workflows = response.data;
        });
      } else {
        throw new Error('Неверный ответ от сервера');
      }
    } catch (err) {
      console.error("Ошибка загрузки рабочих процессов:", err);
      runInAction(() => {
        this.Workflows = [];
      });
    }
  };

  loadStructures = async () => {
    try {
      const response = await getStructures();
      console.log('Structures response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Structures = response.data;
        });
      } else {
        throw new Error('Неверный ответ от сервера');
      }
    } catch (err) {
      console.error("Ошибка загрузки структур:", err);
      runInAction(() => {
        this.Structures = [];
      });
    }
  };

  loadService = async (id: number) => {
    try {
      runInAction(() => {
        this.loading = true;
      });
      
      const response = await getService(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.short_name = response.data.short_name;
          this.code = response.data.code;
          this.description = response.data.description;
          this.day_count = response.data.day_count;
          this.price = response.data.price;
          this.workflow_id = response.data.workflow_id || null;
          this.is_active = response.data.is_active;
          this.date_start = response.data.date_start ? dayjs(response.data.date_start) : null;
          this.date_end = response.data.date_end ? dayjs(response.data.date_end) : null;
          this.law_document_id = response.data.law_document_id || null;
          this.structure_id = response.data.structure_id || null;
          this.isDirty = false; // Сбрасываем флаг после загрузки
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      runInAction(() => {
        this.error = i18n.t("message:somethingWentWrong");
      });
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadLawDocuments = async () => {
    try {
      const response = await getLawDocuments();
      console.log('LawDocuments response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.LawDocuments = response.data;
        });
      } else {
        throw new Error('Неверный ответ от сервера');
      }
    } catch (err) {
      console.error("Ошибка загрузки правовых документов:", err);
      runInAction(() => {
        this.LawDocuments = [];
      });
    }
  };

  async doLoad(id: number) {
    try {
      // Загружаем справочники параллельно
      const promises = [
        this.loadWorkflows(),
        this.loadLawDocuments(),
        this.loadStructures()
      ];
      
      await Promise.all(promises);
      
      console.log('Справочники загружены:', {
        Workflows: this.Workflows.length,
        LawDocuments: this.LawDocuments.length,
        Structures: this.Structures.length
      });
      
      // Загружаем данные услуги если это редактирование
      if (id != null && id > 0) {
        this.id = id;
        await this.loadService(id);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  }
}

export default new NewStore();