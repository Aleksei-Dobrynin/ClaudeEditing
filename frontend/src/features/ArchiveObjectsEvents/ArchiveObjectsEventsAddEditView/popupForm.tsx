import { FC, useEffect } from 'react';
import ArchiveObjectsEventsAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idArchiveObject?: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const ArchiveObjectsEventsPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.idArchiveObject = props.idArchiveObject || null;
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel, props.idArchiveObject, props.id])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="md" fullWidth>
      {/* <DialogTitle>{translate('label:ArchiveObjectsEventsAddEditView.entityTitle')}</DialogTitle> */}
      <DialogContent>
        <ArchiveObjectsEventsAddEditBaseView
          isPopup={true}
          idArchiveObject={props.idArchiveObject}
        >
        </ArchiveObjectsEventsAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_ArchiveObjectsEventsSaveButton"
          name={'ArchiveObjectsEventsAddEditView.save'}
          onClick={() => {
            store.onSaveClick((id: number) => props.onSaveClick(id))
          }}
        >
          {translate("common:save")}
        </CustomButton>
        <CustomButton
          variant="contained"
          id="id_ArchiveObjectsEventsCancelButton"
          name={'ArchiveObjectsEventsAddEditView.cancel'}
          onClick={() => props.onBtnCancelClick()}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
})

export default ArchiveObjectsEventsPopupForm