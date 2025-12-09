import { FC, useEffect } from 'react';
import EmployeeEventAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idEmployee?: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.employee_id !== props.idEmployee) {
      store.employee_id = props.idEmployee
    }
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel, props.idEmployee])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate('label:EmployeeEventAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <EmployeeEventAddEditBaseView
          isPopup={true}
        >
        </EmployeeEventAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_EmployeeEventSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_EmployeeEventCancelButton"
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
