import React, { FC, useEffect } from "react";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import FileField from "../../../components/FileField";

type PopupFormProps = {
  openPanel: boolean;
  application_id: number;
  structure_id: number;
  onBtnCancelClick: () => void;
}

const Uploaded_application_documentPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
    } else {
      store.fileName = "";
      store.File = null;
      store.idDocumentinputKey = "";
      store.errorFileName = "";
      store.fileAdd_id = 0;
      store.fileAdd_application_id = 0;
      store.fileAdd_structure_id = 0;
    }
  }, [props.openPanel]);

  return (
    <Dialog open={props.openPanel} maxWidth="sm" fullWidth>
      <DialogTitle>{translate("label:uploaded_application_documentAddEditView.entityTitle")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>

          <Grid item md={12} xs={12}>
            <FileField
              value={store.fileName}
              helperText={store.errorFileName}
              error={!!store.errorFileName}
              inputKey={store.idDocumentinputKey}
              fieldName="fileName"
              onChange={(event) => {
                if (event.target.files.length == 0) return;
                store.handleChange({ target: { value: event.target.files[0], name: "File" } });
                store.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } });
              }}
              onClear={() => {
                store.handleChange({ target: { value: null, name: "File" } });
                store.handleChange({ target: { value: "", name: "fileName" } });
                store.changeDocInputKey();
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentSaveButton"
            name={"uploaded_application_documentAddEditView.save"}
            onClick={() => {
              store.uploadFile((id: number) => props.onBtnCancelClick())
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentCancelButton"
            name={"uploaded_application_documentAddEditView.cancel"}
            onClick={() => {
              props.onBtnCancelClick()
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default Uploaded_application_documentPopupForm;
