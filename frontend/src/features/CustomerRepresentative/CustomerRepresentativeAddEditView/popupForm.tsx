import { FC, useEffect } from 'react';
import CustomerRepresentativeAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id?: number;
  customer_id?: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
  disabled?: boolean;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { name: "customer_id", value: props.customer_id } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate('label:CustomerRepresentativeAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <CustomerRepresentativeAddEditBaseView
          isPopup={true}
          isDisabled={props.disabled ? props.disabled : false}
        >
        </CustomerRepresentativeAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          {!props.disabled &&<CustomButton
            variant="contained"
            id="id_CustomerRepresentativeSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>}
          <CustomButton
            variant="contained"
            id="id_CustomerRepresentativeCancelButton"
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
