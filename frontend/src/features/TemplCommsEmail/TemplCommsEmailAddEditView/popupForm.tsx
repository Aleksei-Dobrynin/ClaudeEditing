import { FC, useEffect } from 'react';
import TemplCommsEmailAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  template_comms_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const TemplCommsEmailPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { name: "template_comms_id", value: props.template_comms_id } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])


  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:TemplCommsEmailAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <TemplCommsEmailAddEditBaseView
          isPopup={true}
        >
        </TemplCommsEmailAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_TemplCommsEmailSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_TemplCommsEmailCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default TemplCommsEmailPopupForm
