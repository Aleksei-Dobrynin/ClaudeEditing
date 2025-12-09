import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { changePassword } from "../../api/Auth/useAuth";
import { getEmployeeByToken } from "../../api/Employee/useGetGetEmployeeByToken";
import { updateInitials } from "../../api/Employee/useUpdateInitialsEmployee";
import { validate, validateFieldPassword, validateFieldUserName, validateFieldPin, validatePassword } from "./valid";

class NewStore {
  // Поля для смены пароля
  CurrentPassword = "";
  NewPassword = "";
  ConfirmPassword = "";

  // Поля профиля пользователя
  first_name = "";
  last_name = "";
  second_name = "";
  pin = "";
  employeeGuid = "";
  curentEmployeeId = 0;

  // Состояние валидации
  errors: { [key: string]: string } = {};
  touched: { [key: string]: boolean } = {}; // Отслеживаем, какие поля были затронуты
  
  // Функция навигации
  navigate: (path: string) => void = () => {};
  
  constructor() {
    makeAutoObservable(this);
  }

  setNavigateFunction(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  getEmployeeByToken = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeByToken();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // Заполняем поля данными из API
          this.last_name = response.data.last_name || "";
          this.pin = response.data.pin || "";
          this.first_name = response.data.first_name || "";
          this.second_name = response.data.second_name || "";
          this.curentEmployeeId = response.data.id;
          this.employeeGuid = response.data?.guid || "";
          
          // Важно: очищаем состояние валидации при загрузке новых данных
          this.errors = {};
          this.touched = {};
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

  // Обработчик изменения полей формы
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    
    // Обновляем значение поля
    runInAction(() => {
      (this as any)[name] = value;
      // Помечаем поле как затронутое
      this.touched[name] = true;
    });
    
    // Валидируем поле только если оно было затронуто
    this.validateField(name, value);
  }

  // Обработчик потери фокуса (blur)
  handleBlur(name: string) {
    runInAction(() => {
      this.touched[name] = true;
    });
    
    // Запускаем валидацию при потере фокуса
    const value = (this as any)[name];
    this.validateField(name, value);
  }

  // Универсальный метод валидации поля
  async validateField(name: string, value: any) {
    // Валидируем только если поле было затронуто
    if (!this.touched[name]) return;
    
    // Определяем, какой валидатор использовать
    if (name === "first_name" || name === "last_name" || name === "second_name") {
      await this.validateFieldUserName(name, value);
    } else if (name === "pin") {
      await this.validateFieldPin(name, value);
    } else if (name === "CurrentPassword" || name === "NewPassword" || name === "ConfirmPassword") {
      await this.validateFieldPassword(name, value);
    }
  }

  async validateFieldUserName(name: string, value: any) {
    const { isValid, error } = await validateFieldUserName(name, value);
    runInAction(() => {
      if (isValid) {
        this.errors[name] = "";
      } else {
        this.errors[name] = error;
      }
    });
  }

  async validateFieldPin(name: string, value: any) {
    // Исправлено: теперь используется правильная функция валидации
    const { isValid, error } = await validateFieldPin(name, value);
    runInAction(() => {
      if (isValid) {
        this.errors[name] = "";
      } else {
        this.errors[name] = error;
      }
    });
  }

  async validateFieldPassword(name: string, value: any) {
    const { isValid, error } = await validateFieldPassword(name, value);
    runInAction(() => {
      if (isValid) {
        this.errors[name] = "";
      } else {
        this.errors[name] = error;
      }
    });
  }

  // Метод для валидации всех полей (используется при сохранении)
  markAllFieldsAsTouched() {
    runInAction(() => {
      this.touched.first_name = true;
      this.touched.last_name = true;
      this.touched.pin = true;
      if (this.second_name) {
        this.touched.second_name = true;
      }
    });
  }

  onChangeUserName = async () => {
    try {
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        pin: this.pin,
        second_name: this.second_name,
        id: this.curentEmployeeId,
      };

      // Помечаем все поля как затронутые перед валидацией
      this.markAllFieldsAsTouched();
      
      const { isValid, errors } = await validate(data);
      if (!isValid) {
        runInAction(() => {
          this.errors = errors;
        });
        MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
        return;
      }

      MainStore.changeLoader(true);
      const response = await updateInitials(data);

      if (response.status === 201 || response.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        MainStore.changeCurrentuserPin(this.pin);
        // Не очищаем store после успешного сохранения, чтобы данные остались в форме
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:snackbar.errorEdit"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onChangePassword = async () => {
    try {
      const data = {
        Username: localStorage.getItem("currentUser"),
        CurrentPassword: this.CurrentPassword,
        NewPassword: this.NewPassword,
      };
      
      // Помечаем поля паролей как затронутые
      runInAction(() => {
        this.touched.CurrentPassword = true;
        this.touched.NewPassword = true;
        this.touched.ConfirmPassword = true;
      });
      
      const dataValidate = { ...data, ConfirmPassword: this.ConfirmPassword };
      const { isValid, errors } = await validatePassword(dataValidate);
      
      if (!isValid) {
        runInAction(() => {
          this.errors = { ...this.errors, ...errors };
        });
        MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
        return;
      }

      MainStore.changeLoader(true);
      const response = await changePassword(data);

      if (response.status === 201 || response.status === 200) {
        if (response.data) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          this.navigate("/login");
          this.clearPasswordFields();
        } else {
          MainStore.setSnackbar(i18n.t("message:snackbar.errorEdit"), "error");
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

  // Очищаем только поля паролей
  clearPasswordFields = () => {
    runInAction(() => {
      this.CurrentPassword = "";
      this.NewPassword = "";
      this.ConfirmPassword = "";
      // Очищаем ошибки только для полей паролей
      delete this.errors.CurrentPassword;
      delete this.errors.NewPassword;
      delete this.errors.ConfirmPassword;
      delete this.touched.CurrentPassword;
      delete this.touched.NewPassword;
      delete this.touched.ConfirmPassword;
    });
  };

  // Полная очистка store
  clearStore = () => {
    runInAction(() => {
      this.CurrentPassword = "";
      this.NewPassword = "";
      this.ConfirmPassword = "";
      this.employeeGuid = "";
      this.errors = {};
      this.touched = {};
    });
  };
}

export default new NewStore();