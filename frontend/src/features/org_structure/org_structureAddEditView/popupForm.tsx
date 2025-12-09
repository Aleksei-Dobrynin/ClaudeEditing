import React, { FC, useEffect } from 'react';
import Org_structureAddEditBaseView from './base';
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
  idParent: number;
}

const org_structurePopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  useEffect(() => {
    store.handleChange({ target: { value: props.idParent, name: "parent_id" } })
  }, [props.idParent])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="xl" fullWidth>
      <DialogTitle>{translate('label:org_structureAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Org_structureAddEditBaseView
          isPopup={true}
        >
          {store.id > 0 && <Grid item xs={12} spacing={0}><MtmTabs /></Grid>}
        </Org_structureAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_org_structureSaveButton"
            name={'org_structureAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_org_structureCancelButton"
            name={'org_structureAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default org_structurePopupForm
