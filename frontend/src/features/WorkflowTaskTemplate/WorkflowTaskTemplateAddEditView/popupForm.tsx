import React, { FC, useEffect } from 'react';
import WorkflowTaskTemplateAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  idWorkflow: number;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { name: "idWorkflow", value: props.idWorkflow } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth={"xl"}>
      <DialogTitle>{translate('label:WorkflowTaskTemplateAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <WorkflowTaskTemplateAddEditBaseView
          isPopup={true}
        >
        </WorkflowTaskTemplateAddEditBaseView>
        <br/>
        {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}

      </DialogContent>

      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_WorkflowTaskTemplateSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_WorkflowTaskTemplateCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupForm
