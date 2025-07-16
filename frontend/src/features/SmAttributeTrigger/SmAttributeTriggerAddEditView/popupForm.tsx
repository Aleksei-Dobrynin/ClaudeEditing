import { FC, useEffect } from 'react';
import SmAttributeTriggerAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  project_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const SmAttributeTriggerPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { name: "project_id", value: props.project_id } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])


  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:SmAttributeTriggerAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <SmAttributeTriggerAddEditBaseView
          isPopup={true}
        >
        </SmAttributeTriggerAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_SmAttributeTriggerSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_SmAttributeTriggerCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default SmAttributeTriggerPopupForm
