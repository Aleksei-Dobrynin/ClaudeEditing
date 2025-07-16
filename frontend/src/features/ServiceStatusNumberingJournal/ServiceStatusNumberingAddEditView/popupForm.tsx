import { FC, useEffect } from 'react';
import ServiceStatusNumberingAddEditBaseView from './base';
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
  idJournal: number;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.loadServices();
      store.doLoad(props.id)
      store.journal_id = props.idJournal;
    } else {
      store.clearStore()
    }
  }, [props.openPanel, props.idJournal])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick}>
      {/* <DialogTitle>{translate('label:ServiceStatusNumberingAddEditView.entityTitle')}</DialogTitle> */}
      <DialogContent>
        <ServiceStatusNumberingAddEditBaseView
          isPopup={true}
        >
        </ServiceStatusNumberingAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ServiceStatusNumberingSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ServiceStatusNumberingCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default PopupForm
