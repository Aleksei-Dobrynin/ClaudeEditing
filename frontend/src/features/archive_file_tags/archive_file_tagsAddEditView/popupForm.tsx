import { FC, useEffect } from 'react';
import Archive_file_tagsAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  file_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const Archive_file_tagsPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.file_id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:archive_file_tagsAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <Archive_file_tagsAddEditBaseView
          isPopup={true}
        >
        </Archive_file_tagsAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_archive_file_tagsSaveButton"
            name={'archive_file_tagsAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_archive_file_tagsCancelButton"
            name={'archive_file_tagsAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default Archive_file_tagsPopupForm
