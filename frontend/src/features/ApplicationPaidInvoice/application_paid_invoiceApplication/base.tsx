import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type application_paid_invoiceTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseapplication_paid_invoiceView: FC<application_paid_invoiceTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_paid_invoiceForm" id="application_paid_invoiceForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_paid_invoice_TitleName">
                  {translate('label:application_paid_invoiceAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date}
                      onChange={(event) => store.handleChange(event)}
                      name="date"
                      id='id_f_application_paid_invoice_date'
                      label={translate('label:application_paid_invoiceAddEditView.date')}
                      helperText={store.errors.date}
                      error={!!store.errors.date}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.payment_identifier}
                      onChange={(event) => store.handleChange(event)}
                      name="payment_identifier"
                      data-testid="id_f_application_paid_invoice_payment_identifier"
                      id='id_f_application_paid_invoice_payment_identifier'
                      label={translate('label:application_paid_invoiceAddEditView.payment_identifier')}
                      helperText={store.errors.payment_identifier}
                      error={!!store.errors.payment_identifier}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.sum}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                      data-testid="id_f_application_paid_invoice_sum"
                      id='id_f_application_paid_invoice_sum'
                      label={translate('label:application_paid_invoiceAddEditView.sum')}
                      helperText={store.errors.sum}
                      error={!!store.errors.sum}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data-testid="id_f_application_paid_invoice_application_id"
                      id='id_f_application_paid_invoice_application_id'
                      label={translate('label:application_paid_invoiceAddEditView.application_id')}
                      helperText={store.errors.application_id}
                      error={!!store.errors.application_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank_identifier}
                      onChange={(event) => store.handleChange(event)}
                      name="bank_identifier"
                      data-testid="id_f_application_paid_invoice_bank_identifier"
                      id='id_f_application_paid_invoice_bank_identifier'
                      label={translate('label:application_paid_invoiceAddEditView.bank_identifier')}
                      helperText={store.errors.bank_identifier}
                      error={!!store.errors.bank_identifier}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default Baseapplication_paid_invoiceView;
