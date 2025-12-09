import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { login, getUser, recoveryPassword, getMyRoles } from "../../api/Auth/useAuth";
import { jwtDecode } from "jwt-decode";

class NewStore {
  login = "";
  loginForRecovery = "";
  errorloginForRecovery = "";
  password = "";
  errorPassword = "";
  navigate: (path: string) => void = () => {};
  constructor() {
    makeAutoObservable(this);
  }

  setNavigateFunction(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
  }

  onLogin = async () => {
      try {
        MainStore.changeLoader(true);
        var data = {
          Username: this.login,
          Password: this.password,
        };
        this.errorPassword = ""
        const response = await login(data);

        if (response.status === 201 || response.status === 200) {
          if(response.data){
            const { token } = response.data;
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            const responseUser = await getUser(data);
            const responseUserRole = await getMyRoles();
            localStorage.setItem("currentUser", decodedToken.sub);
            console.log(responseUserRole, "responseUserRole")
            if (responseUser.data?.first_reset){
              console.log(responseUser.data.first_reset);
              this.navigate("/user/account-settings");
              window.location.reload();
            } if (responseUserRole.data.includes('head_structure') || responseUserRole.data.includes('employee')) {
              window.location.href = "/user/DashboardEmployee";
              window.location.reload();
            } else if (responseUserRole.data.includes('admin')) {
               window.location.href = "/user";
              window.location.reload();
            } else {
              window.location.href = "user/DashboardHeadDepartment";
              window.location.reload();
            }
            this.clearStore()
          } else {
            this.errorPassword = "error"
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

  onRecoveryPassword = async () => {
      try {
        var data = {
          Email: this.loginForRecovery,
        };
        this.errorloginForRecovery = ""
        const response = await recoveryPassword(data);

        if (response.status === 201 || response.status === 200) {
          if(response.data){
            MainStore.setSnackbar(i18n.t("message:recoveryPasswordSendEmail"), "success");
            this.clearStore()
          } else {
            MainStore.setSnackbar(i18n.t("message:recoveryPasswordFailSendEmail"), "error");
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

  clearStore = () => {
    runInAction(() => {
      this.login = "";
      this.loginForRecovery = "";
      this.password = "";
      this.errorPassword = "";
      this.errorloginForRecovery = "";
    });
  };
}

export default new NewStore();
