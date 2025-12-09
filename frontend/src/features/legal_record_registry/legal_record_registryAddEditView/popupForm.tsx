import { FC, useEffect } from 'react';
import Baseapplication_legal_recordView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="lg" fullWidth>
      {/* <DialogTitle>{translate('label:legal_record_registryAddEditView.entityTitle')}</DialogTitle> */}
      <DialogContent>
        <Baseapplication_legal_recordView
          isPopup={true}
        >
        </Baseapplication_legal_recordView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          {/* <CustomButton
            variant="contained"
            id="id_legal_record_registrySaveButton"
            name={'legal_record_registryAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton> */}
          <CustomButton
            variant="contained"
            id="id_legal_record_registryCancelButton"
            name={'legal_record_registryAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupForm
