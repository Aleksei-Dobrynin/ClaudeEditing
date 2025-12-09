import { FC, useEffect } from 'react';
import ArchObjectAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  custom_address?: string;
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
    if (props.custom_address){
      store.address = props.custom_address;
      store.name = props.custom_address;
    }

  }, [props.openPanel])

  return (
    <Dialog maxWidth={"xl"} fullWidth open={props.openPanel} onClose={props.onBtnCancelClick}>
      {/* <DialogTitle>{translate('label:ArchObjectAddEditView.entityTitle')}</DialogTitle> */}
      <DialogContent>
        <ArchObjectAddEditBaseView
          isPopup={true}
        >
        </ArchObjectAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ArchObjectSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ArchObjectCancelButton"
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
