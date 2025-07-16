import { FC, useEffect } from 'react';
import CustomerDiscountDocumentsAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idCustomer?: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.customer_discount_id = props.idCustomer ?? 0;
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogTitle>{translate('label:CustomerDiscountDocumentsAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <CustomerDiscountDocumentsAddEditBaseView
          isPopup={true}
        >
        </CustomerDiscountDocumentsAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_CustomerDiscountDocumentsSaveButton"
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_CustomerDiscountDocumentsCancelButton"
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
