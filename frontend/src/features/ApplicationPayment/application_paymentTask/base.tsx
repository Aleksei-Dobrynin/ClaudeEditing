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

type application_paymentTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseapplication_paymentView: FC<application_paymentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_paymentForm" id="application_paymentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_payment_TitleName">
                  {translate('label:application_paymentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_application_payment_description"
                      id='id_f_application_payment_description'
                      label={translate('label:application_paymentAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.sum}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                      type="number"
                      data-testid="id_f_application_payment_sum"
                      id='id_f_application_payment_sum'
                      label={translate('label:application_paymentAddEditView.sum')}
                      helperText={store.errors.sum}
                      error={!!store.errors.sum}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.org_structures}
                      id='id_f_application_payment_structure_id'
                      label={translate('label:application_paymentAddEditView.structure_id')}
                      helperText={store.errors.structure_id}
                      error={!!store.errors.structure_id}
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

export default Baseapplication_paymentView;
