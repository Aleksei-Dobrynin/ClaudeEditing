import { FC, useEffect } from 'react';
import TemplCommsReminderAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  template_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const TemplCommsReminderPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { name: "template_id", value: props.template_id } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])


  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:TemplCommsReminderAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <TemplCommsReminderAddEditBaseView
          isPopup={true}
        >
        </TemplCommsReminderAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_TemplCommsReminderSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_TemplCommsReminderCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default TemplCommsReminderPopupForm
