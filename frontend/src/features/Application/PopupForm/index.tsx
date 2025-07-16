import { FC, useEffect } from 'react';
import store from "./store"
import { observer } from "mobx-react"
import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import ApplicationDetails from './info';
import FastInputapplication_paymentView from "features/ApplicationPayment/application_paymentAddEditView/fastInput";
import FastInputapplication_paid_invoiceView from "features/ApplicationPaidInvoice/application_paid_invoiceApplication/fastInput";
import Saved_application_documentListView from "features/saved_application_document/saved_application_documentListView";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onClose: () => void;
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
    <Dialog fullWidth maxWidth={"xl"} open={props.openPanel} onClose={props.onClose}>
      <DialogContent>
        <ApplicationDetails />

        <Container maxWidth='xl' >
        {store.id !== 0 && <FastInputapplication_paymentView idMain={store.id} statusCode={store.status_code} />}
        {store.id !== 0 && <FastInputapplication_paid_invoiceView idMain={store.id} />}
        </Container>
        {store.id !== 0 && <Saved_application_documentListView idMain={store.id} />}

      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_ApplicationCancelButton"
          onClick={() => props.onClose()}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions >
    </Dialog >
  );
})

export default PopupForm
