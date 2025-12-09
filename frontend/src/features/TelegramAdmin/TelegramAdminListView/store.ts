import { makeAutoObservable } from "mobx";
import MainStore from "../../../MainStore";
import i18n from "i18next";
import { getSubjects } from "../../../api/TelegramAdmin/telegram_subjects/useGetSubjects";
import { deleteSubjects } from "../../../api/TelegramAdmin/telegram_subjects/useDeleteSubject";
import { getQuestions } from "../../../api/TelegramAdmin/telegram_questions/useGetQuestions";
import { GetNumberOfChats } from "../../../api/TelegramAdmin/telegram_questions/useGetNumberOfChats";
import { TelegramChars } from "../../../constants/TelegramAdmin/TelegramChars";
import { Dayjs } from "dayjs";
import { GetNumberOfChatsByDate } from "../../../api/TelegramAdmin/telegram_questions/useGetNumberOfChatsByDate";
import { telegram_questions } from "../../../constants/TelegramAdmin/telegram_questions";
import { GetClicked } from "../../../api/TelegramAdmin/user_selectable_questions_telegram/useGetClicked";


class NewStore {
  data: [];
  dataQuestions: telegram_questions[];
  dataChars: TelegramChars[];
  startDate: Dayjs;
  endDate: Dayjs;
  dataQuestionsWithCount: TelegramChars[] = [];
  startDateQuestionsDiagram: Dayjs;
  endDateQuestionsDiagram: Dayjs;


  constructor() {
    makeAutoObservable(this);
  }
  handleChange (e) {
    const { name, value } = e.target
    this[name] = value;
    if (name === "startDate" || name === "endDate"){
      if (this.startDate != null) {
        (async () => {
          await this.loadChatsGroupByMonthWhithDate();
        })();
      }
  }
    if (name === "startDateQuestionsDiagram" || name === "endDateQuestionsDiagram"){
        (async () => {
          await this.loadClickedQuestionsCounts();
        })();

    }
}
  async loadSubjects() {
    try {
      MainStore.changeLoader(true);
      const response = await getSubjects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadQuestions() {
    try {
      MainStore.changeLoader(true);
      const response = await getQuestions();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dataQuestions = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadChatsGroupByMonth() {
    try {
      MainStore.changeLoader(true);
      const response = await GetNumberOfChats();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dataChars = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteSubjects(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteSubjects(id);
          if (response.status === 201 || response.status === 200) {
            await this.loadSubjects();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
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

  async loadChatsGroupByMonthWhithDate() {
    try {
      MainStore.changeLoader(true);
      const startDate = this.startDate.format("YYYY-MM-DD")
      const endDate = this.endDate ? this.endDate.format( "YYYY-MM-DD"): ""
      const response = await GetNumberOfChatsByDate(startDate, endDate);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dataChars = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadClickedQuestionsCounts() {
    try {
      MainStore.changeLoader(true);
      const startDate = this.startDateQuestionsDiagram ? this.startDateQuestionsDiagram.format("YYYY-MM-DD") : "";
      const endDate = this.endDateQuestionsDiagram ? this.endDateQuestionsDiagram.format( "YYYY-MM-DD"): "";
      const response = await GetClicked(startDate, endDate);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.dataQuestionsWithCount = response.data;
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