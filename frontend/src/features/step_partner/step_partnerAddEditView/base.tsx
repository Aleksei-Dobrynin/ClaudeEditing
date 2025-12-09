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

type step_partnerTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Basestep_partnerView: FC<step_partnerTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="step_partnerForm" id="step_partnerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="step_partner_TitleName">
                  {translate('label:step_partnerAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.partner_id}
                      onChange={(event) => store.handleChange(event)}
                      name="partner_id"
                      data={store.contragents}
                      id='id_f_step_partner_partner_id'
                      label={translate('label:step_partnerAddEditView.partner_id')}
                      helperText={store.errors.partner_id}
                      error={!!store.errors.partner_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.role}
                      onChange={(event) => store.handleChange(event)}
                      name="role"
                      data-testid="id_f_step_partner_role"
                      id='id_f_step_partner_role'
                      label={translate('label:step_partnerAddEditView.role')}
                      helperText={store.errors.role}
                      error={!!store.errors.role}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:step_partnerAddEditView.is_required')}
                      id='id_f_step_partner_is_required'
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

export default Basestep_partnerView;
