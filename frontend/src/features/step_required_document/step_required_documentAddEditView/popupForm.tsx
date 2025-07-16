import React, { FC, useEffect } from 'react';
import Step_required_documentAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import MtmTabs from "./mtmTabs";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  step_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const step_required_documentPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.step_id = props.step_id;
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="xl" fullWidth>
      <DialogTitle>{translate('label:step_required_documentAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Step_required_documentAddEditBaseView
          isPopup={true}
        >
          {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
        </Step_required_documentAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_step_required_documentSaveButton"
            name={'step_required_documentAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_step_required_documentCancelButton"
            name={'step_required_documentAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default step_required_documentPopupForm
