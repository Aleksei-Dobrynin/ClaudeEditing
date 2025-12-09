import { FC, useEffect } from 'react';
import Uploaded_application_documentAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  application_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const Uploaded_application_documentCreatePopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { value: props.application_id, name: "application_document_id" } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:uploaded_application_documentAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Uploaded_application_documentAddEditBaseView
          isPopup={true}
        >
        </Uploaded_application_documentAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentSaveButton"
            name={'uploaded_application_documentAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentCancelButton"
            name={'uploaded_application_documentAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default Uploaded_application_documentCreatePopupForm
