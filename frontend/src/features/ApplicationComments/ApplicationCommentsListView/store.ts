import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {getCommentsByApplicationId} from "../../../api/ApplicationComments/useGetByApplicationCommentByAplicationId";
import {ApplicationComments} from "../../../constants/ApplicationComments";
import {updateComments} from "../../../api/ApplicationComments/useUpdateApplicationComment";

import {createComments} from "../../../api/ApplicationComments/useCreateApplicationComment";
import {deleteComments} from "../../../api/ApplicationComments/useDeleteApplicationComments";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import storeApplication from "../../Application/ApplicationAddEditView/store";

class NewStore { 
    dataAll = [];
    data = [];
    userLocalStorage = "";
    id = 0;
    comment = "";
    application_id = 0;
    created_at = null;
    updated_at = null;
    created_by = "";
    updated_by = "";

    isOpenComment = false;
    isEdit = 0;


    constructor() {
        makeAutoObservable(this);
      }

  clearStore() {
    runInAction(() => {
      this.dataAll = [];
      this.data = [];
      this.userLocalStorage = "";
      this.id = 0;
      this.comment = "";
      // this.application_id = 0;
      this.created_at = null;
      this.updated_at = null;
      this.created_by = "";
      this.updated_by = "";
    })
  }

      openPanel() {
        this.isOpenComment = true;
      }
      closePanel() {
        this.isOpenComment = false;
      }

      onEditCustomerClicked(comment: ApplicationComments) {
        this.id = comment.id;
        this.comment = comment.comment;
        this.application_id = comment.application_id;
        this.created_at = comment.created_at;
        this.updated_at = comment.updated_at;
        this.created_by = comment.created_by;
        this.updated_by = comment.updated_by;
        this.isEdit = comment.id;
      }

      handleChange(event) {
        this[event.target.name] = event.target.value;
      }


      getUser () {
        const userLocalStorageJson = localStorage.getItem("currentUser");
        if (userLocalStorageJson != null ){ 
            this.userLocalStorage = userLocalStorageJson;
        }
      }

      loadAllComments = async (id) => {
        try {
          MainStore.changeLoader(true);
          const response = await getCommentsByApplicationId(id);
          if ((response.status === 201 || response.status === 200) && response?.data !== null) {
            this.dataAll = response.data;
            if (response.data.length > 3) {
              this.data = response.data.slice(-3);
            } else {
              this.data = response.data;
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

      setApplicationId(id: number) {
        this.application_id = id;
      }

      onSaveClick = async (onSaved: (id?: number) => void) => {
          try {
            MainStore.changeLoader(true);
            var data = {
              id: this.id,
              comment: this.comment,
              application_id: this.application_id,
              created_at: this.created_at,
              updated_at: this.updated_at,
              created_by: this.created_by,
              updated_by: this.updated_by,
              userEmail: localStorage.getItem("currentUser")
            };
            
            const response = data.id === 0
              ? await createComments(data)
              : await updateComments(data);
            if (response.status === 201 || response.status === 200) {
              onSaved(response.data.id);
              if (data.id === 0) {
                
                this.id = response.data.id;
                MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
              } else {
                MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
              }
              this.id = 0;
              this.comment = "";
              this.created_at = "";
              this.updated_at = "";
              this.created_by = "";
              this.updated_by = "";
              this.isEdit = 0;
              this.loadAllComments(this.application_id)
            } else {
              throw new Error();
            }
          } catch (err) {
            MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
          } finally {
            MainStore.changeLoader(false);
          }
      };

       formatDate (date){
        dayjs.extend(relativeTime);
        const today = dayjs();
        const createdAt = dayjs(date);
        
        if (today.isSame(createdAt, 'day')) {
          return `Сегодня в ${createdAt.format('HH:mm')}`;
        } else if (today.subtract(1, 'day').isSame(createdAt, 'day')) {
          return `Вчера в ${createdAt.format('HH:mm')}`;
        } else if (today.subtract(2, 'days').isSame(createdAt, 'day')) {
          return `Позавчера в ${createdAt.format('HH:mm')}`;
        } else {
          return createdAt.format('YYYY-MM-DD в HH:mm');
        }
      };

      deleteComment = (id: number) => {
        MainStore.openErrorConfirm(
          i18n.t("areYouSure"),
          i18n.t("delete"),
          i18n.t("no"),
          async () => {
            try {
              MainStore.changeLoader(true);
              const response = await deleteComments(id);
              if (response.status === 201 || response.status === 200) {
                this.loadAllComments(this.application_id);
                MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
              } else {
                throw new Error();
              }
            } catch (err) {
              MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
            } finally {
              MainStore.changeLoader(false);
              MainStore.onCloseConfirm();
            }
          },
          () => MainStore.onCloseConfirm()
        );
      };
}

export default new NewStore();