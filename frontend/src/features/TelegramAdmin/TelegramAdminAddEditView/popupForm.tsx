import React, { FC, useEffect } from "react";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import CustomTextField from "../../../components/TextField";
import FileField from "./FileField";

type PopupFormProps = {
  [x: string]: any;
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  load: (id: number) => void;
}

const TelegramAdminPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      (() => {
        if(props.id !== 0) {
          props.load(props.id);
        }
      })();
    } else {
      store.clearStorePopUp();
    }
  }, [props.openPanel]);

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate("label:TelegramAdminAddEditView.popupTitle")}</DialogTitle>
      <DialogContent>
        <Grid item md={12} xs={12} sx={{margin:"15px 0 20px 0"}}>
          <CustomTextField
            value={store.nameQuestions}
            onChange={(event) => store.handleChange(event)}
            name="nameQuestions"
            data-testid="id_nameQuestionsPopUp_name"
            id="id_f_nameQuestionsPopUp_name"
            label={translate("label:TelegramAdminAddEditView.question")}
            multiline
            rows={4}
            // helperText={store.errors.name}
            // error={!!store.errors.name}
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{margin:"15px 0 20px 0"}}>
          <CustomTextField
            value={store.nameQuestions_kg}
            onChange={(event) => store.handleChange(event)}
            name="nameQuestions_kg"
            data-testid="id_nameQuestions_kgPopUp_name"
            id="id_f_nameQuestions_kgPopUp_name"
            label={translate("label:TelegramAdminAddEditView.question_kg")}
            multiline
            rows={4}
            // helperText={store.errors.name}
            // error={!!store.errors.name}
          />
        </Grid>

        <Grid item md={12} xs={12} sx={{margin:"15px 0 20px 0"}}>
          <CustomTextField
            value={store.answer}
            onChange={(event) => store.handleChange(event)}
            name="answer"
            data-testid="id_answerPopUp_name"
            id="id_f_answerPopUp_name"
            label={translate("label:TelegramAdminAddEditView.answer")}
            multiline
            rows={4}
            // helperText={store.errors.name}
            // error={!!store.errors.name}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <CustomTextField
            value={store.answer_kg}
            onChange={(event) => store.handleChange(event)}
            name="answer_kg"
            data-testid="id_answer_kgPopUp_name"
            id="id_f_answer_kgPopUp_name"
            label={translate("label:TelegramAdminAddEditView.answer_kg")}
            multiline
            rows={4}
            // helperText={store.errors.name}
            // error={!!store.errors.name}
          />
        </Grid>

        <Grid item md={12} xs={12} sx={{marginTop: "20px"}}>
          <FileField
            helperText={store.errors.fileName}
            error={!!store.errors.fileName}
            inputKey={store.idDocumentinputKey}
            fieldName="fileName"
            label={translate("label:TelegramAdminAddEditView.document")}
            onChange={(event) => {
              if (event.target.files.length === 0) return
              store.changeDocInputKey()
              store.handleChangeInput(event);
            }}
            onClear={() => {
              store.handleChange({ target: { value: [], name: "File" } })
              store.handleChange({ target: { value: '', name: "fileName" } })
              store.changeDocInputKey()
            }}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_TelegramAdminSaveButton"
            name={"task_typeAddEditView.save"}
            onClick={() => {

              (async () => {
               await store.onSaveClickAnswerQuestion((id: number) => store.closePanel())
               await store.loadQuestions();
              })()

            }
          }
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_TelegramCancelButton"
            name={"task_typeAddEditView.cancel"}
            onClick={() => {
              store.closePanel();
              store.clearStorePopUp();
              store.loadQuestions();
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});


export default TelegramAdminPopupForm;
