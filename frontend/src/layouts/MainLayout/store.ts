import { getMyRoles, isSuperAdmin } from "api/Auth/useAuth";
import { clearNotification, clearNotifications, getmynotifications } from "api/notification";
import { notification } from "constants/notification";
import i18n from "i18n";
import MainStore from "MainStore";
import { makeAutoObservable, runInAction } from "mobx";
import { getEmployeeByEmail } from 'api/Employee/useGetEmployeeByEmail';
import ReleaseApproveSectionStore from './Header/ReleaseApproveSection/store'

interface EmployeeResponse {
  last_name: string;
  first_name: string;
}

class NewStore {
  drawerOpened = false;
  notifications: notification[] = [];
  curentUserName = '';
  last_name = '';
  employee_id = 0;
  user_id = 0;
  first_name = '';
  head_of_structures = [];
  my_structures = [];
  post_ids = [];
  openPanel = false;
  open = false; // Menu open state
  selectedIndex = 0; // Index of the selected list item
  isSuperAdmin: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      // Reset or clear state as needed
    });
  }

  async loadCurrentEmployee(email: string) {
    try {
      MainStore.changeLoader(true);
      const response = await getEmployeeByEmail(email);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.employee_id = response.data.id;
          this.user_id = response.data.uid;
          this.last_name = response.data.last_name;
          this.first_name = response.data.first_name;
          this.head_of_structures = response.data.head_of_structures;
          this.my_structures = response.data.my_structures;
          this.post_ids = response.data.post_ids;
          MainStore.changeCurrentuserPin(response.data.pin);
        });
        if(!response.data?.release_read){
          ReleaseApproveSectionStore.changePanel(true)
        }
      } else {
        throw new Error('Failed to load employee data');
      }
    } catch (err) {
      console.error('Error loading employee data:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async getNotifications() {
    try {
      const response = await getmynotifications();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.notifications = response.data;
        });
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      MainStore.setSnackbar(i18n.t('message:cannotLoadNotifications'), 'error');
    }
  }

  async checkIsSuperAdmin() {
    const currentUser = localStorage.getItem("currentUser")
    try {
      const response = await isSuperAdmin(currentUser);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.isSuperAdmin = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:cannotLoadNotifications"), "error");
    }
  }

  async clearAllNotifies() {
    const currentUser = localStorage.getItem('currentUser');
    try {
      if (!currentUser) throw new Error('No current user found');
      MainStore.changeLoader(true);
      const response = await clearNotifications(currentUser);
      console.log('clearAllNotifies response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        await this.getNotifications(); // Refresh notifications after clearing
      } else {
        throw new Error('Failed to clear notifications');
      }
    } catch (err) {
      console.error('Error clearing notifications:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async clearNotify(id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await clearNotification(id);
      console.log('clearNotify response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        await this.getNotifications(); // Refresh notifications after clearing
      } else {
        throw new Error('Failed to clear notification');
      }
    } catch (err) {
      console.error('Error clearing notification:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  // Method to toggle the menu open state
  setOpen(isOpen: boolean) {
    this.open = isOpen;
  }

  // Method to set the selected index
  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  // Method to toggle the drawer state
  changeDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }
}

export default new NewStore();