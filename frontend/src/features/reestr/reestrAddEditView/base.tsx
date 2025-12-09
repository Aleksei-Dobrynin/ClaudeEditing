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

type reestrTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BasereestrView: FC<reestrTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="reestrForm" id="reestrForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="reestr_TitleName">
                  {translate('label:reestrAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_reestr_name"
                      id='id_f_reestr_name'
                      label={translate('label:reestrAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      value={store.month}
                      onChange={(event) => store.handleChange(event)}
                      name="month"
                      data={store.months}
                      id='id_f_reestr_month'
                      label={translate('label:reestrAddEditView.month')}
                      helperText={store.errors.month}
                      error={!!store.errors.month}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      value={store.year}
                      onChange={(event) => store.handleChange(event)}
                      name="year"
                      data={store.years}
                      id='id_f_reestr_year'
                      label={translate('label:reestrAddEditView.year')}
                      helperText={store.errors.year}
                      error={!!store.errors.year}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.year}
                      onChange={(event) => store.handleChange(event)}
                      name="year"
                      data-testid="id_f_reestr_year"
                      id='id_f_reestr_year'
                      label={translate('label:reestrAddEditView.year')}
                      helperText={store.errors.year}
                      error={!!store.errors.year}
                    />
                  </Grid> */}
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

export default BasereestrView;
