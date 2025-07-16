import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { validateField } from "./valid";
import { getSubject } from "../../../api/TelegramAdmin/telegram_subjects/useGetSubject";
import { createSubject } from "../../../api/TelegramAdmin/telegram_subjects/useCreateSubject";
import { updateSubject } from "../../../api/TelegramAdmin/telegram_subjects/useUpdateSubject";
import { getQuestionsByIdSubject } from "../../../api/TelegramAdmin/telegram_questions/useGetBySubject";
import { telegram_questions } from "../../../constants/TelegramAdmin/telegram_questions";
import { AxiosResponse } from "axios";
import { getQuestionById } from "../../../api/TelegramAdmin/telegram_questions/useGetOneQuestion";
import { createQuestions } from "../../../api/TelegramAdmin/telegram_questions/useCreateQuestion";
import { updateQuestions } from "../../../api/TelegramAdmin/telegram_questions/useUpdateQuestion";
import { deleteQuestion } from "../../../api/TelegramAdmin/telegram_questions/useDeleteQuestion";
import { Remove } from "@mui/icons-material";
import { Files, FileType } from "../../../constants/Files";

// dictionaries

class NewStore {
  id = 0;
  name = "";
  name_kg = "";
  openPanel = false;
  currentId = 0;
  tableName = "";

  // questions
  idQuestions = 0;
  nameQuestions = "";
  idSubject = 0;
  answer = "";
  answer_kg = "";
  nameQuestions_kg = "";
  file_id: number | null = null;

  fileName = "";
  File: FileType[] = [];
  idDocumentinputKey = "";
  dataQuestions: telegram_questions[];
  errors: { [key: string]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  handleChangeInput(e) {
    const filesArray: File[] = Array.from(e.target.files);
    filesArray?.forEach((item, index) => {
        const findIndex = this.File?.findIndex(x => x.file.name === item.name)
        if (findIndex === -1) {
          this.File.push( {id: 0, file: item})
        }
      })
  }

  handleDeleteFile(fileName:string) {
    this.File = this.File.filter(item => item.file.name !== fileName);
  }
  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.name_kg = "";
      this.errors = {}
    });
  }

  clearStorePopUp() {
    runInAction(() => {
      this.idQuestions = 0;
      this.nameQuestions = "";
      this.nameQuestions_kg = "";
      this.idSubject = 0;
      this.answer = "";
      this.answer_kg = "";
      this.errors = {};
      this.fileName = "";
      this.File = [];
      this.idDocumentinputKey = "";
    });
  }
  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }
  closePanel =() => {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }
  onCreateClicked = () => {
    runInAction(() => {
      this.openPanel = true;
    });
  }


  onEditClicked = (id: number) => {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    (this as any)[name] = value;
    // this.validateField(name, value);
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClickSubject(onSaved: (id: number) => void) {
    let data = {
      id: this.id - 0,
      name: this.name,
      name_kg: this.name_kg
    };

    // const { isValid, errors } = await validate(data);
    // if (!isValid) {
    //   this.errors = errors;
    //   MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    //   return;
    // }

    try {
      MainStore.changeLoader(true);
      let response;
      if (this.id === 0) {
        response = await createSubject(data);
      } else {
        response = await updateSubject(data);
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

  deleteQuestion = (id: number) =>  {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteQuestion(id);
          if (response.status === 201 || response.status === 200) {
            await  this.loadQuestions();
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

  async onSaveClickAnswerQuestion(onSaved: (id: number) => void) {
    let data = {
      id: this.idQuestions,
      name: this.nameQuestions,
      idSubject: this.id,
      answer: this.answer,
      answer_kg: this.answer_kg,
      name_kg: this.nameQuestions_kg
    };

    // const { isValid, errors } = await validate(data);
    // if (!isValid) {
    //   this.errors = errors;
    //   MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    //   return;
    // }

    try {
      MainStore.changeLoader(true);
      let response;
        if (this.idQuestions === 0) {
          let files = this.File.map(item => item.file)
          response = await createQuestions(data, files);
        } else {
          const oldFile = this.File.filter(x => x.id !== 0);
          const newFile = this.File.filter(x => x.id === 0);

          response = await updateQuestions(data, newFile, oldFile);

        }
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        if (data.id === 0) {
          await this.loadQuestions();
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

  loadSubject = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getSubject(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.name_kg = response.data.name_kg;
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
  async loadQuestions() {
    try {
      MainStore.changeLoader(true);
      const response = await getQuestionsByIdSubject(this.id);
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

   loadOnePopUp= async (id: number) => {
     try {
      MainStore.changeLoader(true);
       const response = await getQuestionById(id);
       if ((response.status === 201 || response.status === 200) && response?.data !== null) {
         this.idQuestions = response.data.id;
         this.nameQuestions = response.data.name;
         this.idSubject = response.data.idSubject;
         this.answer = response.data.answer;
         this.nameQuestions_kg = response.data.name_kg;
         this.answer_kg = response.data.answer_kg;
         this.File = response.data.document.map(item => {
           return {
             id: item.id,
             file: item
           }
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
    if (id === null || id === 0) {
      return;
    }
    this.id = id;
    await this.loadSubject(id);
    await this.loadQuestions();
  }
}

export default new NewStore();
