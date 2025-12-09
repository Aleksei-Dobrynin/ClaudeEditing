import React, { FC, useEffect } from 'react';
import Path_stepAddEditBaseView from './base';
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
  service_path_id: number;
}

const path_stepPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.path_id = props.service_path_id;
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="xl" fullWidth>
      <DialogTitle>{translate('label:path_stepAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Path_stepAddEditBaseView
          isPopup={true}
        >
          {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
        </Path_stepAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_path_stepSaveButton"
            name={'path_stepAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_path_stepCancelButton"
            name={'path_stepAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default path_stepPopupForm
